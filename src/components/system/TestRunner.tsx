import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SystemCheckProgress from './SystemCheckProgress';

const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');

  const runTestsMutation = useMutation({
    mutationFn: async () => {
      setIsRunning(true);
      setProgress(0);
      setCurrentTest('Initializing tests...');

      // Broadcast initial message to debug channel
      await supabase
        .channel('debug-logs')
        .send({
          type: 'broadcast',
          event: 'debug-log',
          payload: {
            message: 'Starting test run...'
          }
        });

      const { data, error } = await supabase.functions.invoke('run-tests', {
        body: { command: 'test' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setProgress(100);
      setCurrentTest('All tests complete');
      // Broadcast success message
      supabase
        .channel('debug-logs')
        .send({
          type: 'broadcast',
          event: 'debug-log',
          payload: {
            message: 'Tests completed successfully'
          }
        });
    },
    onError: (error) => {
      setProgress(0);
      setCurrentTest('Test run failed');
      // Broadcast error message
      supabase
        .channel('debug-logs')
        .send({
          type: 'broadcast',
          event: 'debug-log',
          payload: {
            message: `Error running tests: ${error.message}`
          }
        });
    },
    onSettled: () => {
      setIsRunning(false);
    }
  });

  // Subscribe to real-time test logs
  useQuery({
    queryKey: ['test-logs'],
    queryFn: async () => {
      const channel = supabase
        .channel('test-logs')
        .on('broadcast', { event: 'test-log' }, ({ payload }) => {
          setProgress(payload.progress || progress);
          setCurrentTest(payload.currentTest || currentTest);
          // Broadcast to debug channel
          supabase
            .channel('debug-logs')
            .send({
              type: 'broadcast',
              event: 'debug-log',
              payload: {
                message: payload.message
              }
            });
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    },
    enabled: isRunning
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Test Runner
        </h2>
        <Button
          onClick={() => runTestsMutation.mutate()}
          disabled={isRunning}
        >
          Run Tests
        </Button>
      </div>

      {isRunning && (
        <SystemCheckProgress
          currentCheck={currentTest}
          progress={progress}
          totalChecks={100}
          completedChecks={Math.floor(progress)}
        />
      )}

      {runTestsMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to run tests: {runTestsMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
};

export default TestRunner;