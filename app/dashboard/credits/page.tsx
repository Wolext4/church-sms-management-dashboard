'use client';

import { useEffect, useState } from 'react';
import { useCreditsStore } from '@/lib/store/credits';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingUp, ArrowUp, ArrowDown, Zap, Check, ArrowRight } from 'lucide-react';

export default function CreditsPage() {
  const { balance, packages, transactions, fetchBalance, fetchPackages, fetchTransactions, purchaseCredits, isLoading } =
    useCreditsStore();
  const { addNotification } = useNotificationsStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      await fetchBalance();
      await fetchPackages();
      await fetchTransactions(page);
    };
    loadData();
  }, [page, fetchBalance, fetchPackages, fetchTransactions]);

  const handlePurchase = async (packageId: string) => {
    try {
      await purchaseCredits(packageId);
      addNotification({
        type: 'SUCCESS',
        title: 'Purchase Successful',
        message: 'Credits have been added to your account',
      });
    } catch (error) {
      addNotification({
        type: 'ERROR',
        title: 'Purchase Failed',
        message: 'Could not complete purchase. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credits</h1>
        <p className="text-gray-600 mt-2">Manage and purchase SMS credits</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-600 font-medium">Available Credits</p>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{balance?.available || 0}</p>
          <p className="text-sm text-blue-700 mt-2">Ready to use</p>
        </div>

        {/* Used */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-purple-600 font-medium">Used This Month</p>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-4xl font-bold text-purple-900">{balance?.used || 0}</p>
          <p className="text-sm text-purple-700 mt-2">Total consumption</p>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-green-600 font-medium">Total Balance</p>
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-4xl font-bold text-green-900">{balance?.total || 0}</p>
          <p className="text-sm text-green-700 mt-2">All time credits</p>
        </div>
      </div>

      {/* Purchase Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Buy Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.length === 0 ? (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No packages available at the moment</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                {pkg.discount && (
                  <div className="mb-3 inline-flex w-fit">
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      Save {pkg.discount}%
                    </span>
                  </div>
                )}

                <h3 className="font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                {pkg.description && (
                  <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="text-3xl font-bold text-blue-600">{pkg.creditsAmount}</p>
                </div>

                <div className="mb-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-gray-900">${pkg.price}</p>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isLoading}
                  className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Processing...' : 'Buy Now'}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.type === 'PURCHASE' ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-green-50 rounded">
                                <ArrowDown className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">Purchase</span>
                            </div>
                          ) : transaction.type === 'USAGE' ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-red-50 rounded">
                                <ArrowUp className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">Usage</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-50 rounded">
                                <ArrowDown className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">Refund</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              transaction.type === 'USAGE' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {transaction.type === 'USAGE' ? '-' : '+'}
                            {transaction.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.balance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page <span className="font-medium">{page}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={transactions.length < 10 || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
