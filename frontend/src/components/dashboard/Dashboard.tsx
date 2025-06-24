"use client";

import { useState } from "react";
import { BarChart3, History, Plus } from "lucide-react";
import { ConversionForm } from "./ConversionForm";
import { ConversionHistory } from "./ConversionHistory";
import { AnalyticsOverview } from "./StatsOverview";
import { DashboardHeader } from "./header";

type ActiveTab = "convert" | "history" | "analytics";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("convert");

  const tabs = [
    { id: "convert", label: "Convert", icon: Plus },
    { id: "history", label: "History", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "border-black text-black dark:text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === "convert" && (
          <div className="flex flex-col items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-center dark:text-white">
                Currency Conversion
              </h1>
              <p className="mt-1 text-sm text-gray-600 text-center dark:text-gray-400">
                Convert currencies with real-time exchange rates
              </p>
            </div>
            <ConversionForm />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Conversion History
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                View and manage your past currency conversions
              </p>
            </div>
            <ConversionHistory />
          </div>
        )}

        {activeTab === "analytics" && <AnalyticsOverview />}
      </main>
    </div>
  );
}
