import React, { useState, useEffect } from 'react';
import LogsHeader from './logs/LogsHeader';
import { LogsTabs } from './logs/LogsTabs';
import { AuditLogsList } from './logs/AuditLogsList';
import MonitoringLogsList from './logs/MonitoringLogsList';
import { DebugConsole } from './logs/DebugConsole';
import { LOGS_TABS, LogsTabsType } from '@/constants/logs';
import { supabase } from "@/integrations/supabase/client";

const AuditLogsView = () => {
  const [activeTab, setActiveTab] = useState<LogsTabsType>(LOGS_TABS.AUDIT);
  const [debugLogs, setDebugLogs] = useState<string[]>(['Debug logging initialized']);

  useEffect(() => {
    // Subscribe to debug logs channel
    const channel = supabase
      .channel('debug-logs')
      .on('broadcast', { event: 'debug-log' }, ({ payload }) => {
        setDebugLogs(prev => [...prev, payload.message]);
      })
      .subscribe();

    // Add initial system check log
    setDebugLogs(prev => [...prev, 'System check completed']);
    
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <LogsHeader 
        title="System Logs"
        subtitle="View and manage system audit and monitoring logs"
      />
      
      <LogsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === LOGS_TABS.AUDIT && <AuditLogsList />}
      {activeTab === LOGS_TABS.MONITORING && <MonitoringLogsList />}
      
      <DebugConsole logs={debugLogs} />
    </div>
  );
};

export default AuditLogsView;