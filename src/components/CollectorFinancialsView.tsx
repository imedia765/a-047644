import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';
import CollectorsList from './CollectorsList';
import { Card } from "@/components/ui/card";

const CollectorFinancialsView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Financial & Collector Management</h1>
        <p className="text-dashboard-text">Manage payments and collector assignments</p>
      </header>

      <Card className="bg-dashboard-card border-dashboard-accent1/20">
        <Tabs defaultValue="overview" className="p-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 gap-4 bg-dashboard-dark">
            <TabsTrigger value="overview">Payment Overview</TabsTrigger>
            <TabsTrigger value="collectors">Collectors Overview</TabsTrigger>
            <TabsTrigger value="payments">All Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <PaymentStatistics />
          </TabsContent>

          <TabsContent value="collectors" className="mt-6">
            <div className="space-y-8">
              <CollectorsList />
              <CollectorsSummary />
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <AllPaymentsTable showHistory={true} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CollectorFinancialsView;