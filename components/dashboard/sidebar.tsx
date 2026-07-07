'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, BarChart3, Send, CreditCard, Users, Building2, FileText, Settings, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'SMS',
    href: '/dashboard/sms',
    icon: Send,
    submenu: [
      { label: 'Quick Send', href: '/dashboard/sms/quick-send' },
      { label: 'Bulk Send', href: '/dashboard/sms/bulk-send' },
      { label: 'Templates', href: '/dashboard/sms/templates' },
      { label: 'History', href: '/dashboard/sms/history' },
    ],
  },
  {
    label: 'Credits',
    href: '/dashboard/credits',
    icon: CreditCard,
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    label: 'Church',
    href: '/dashboard/church',
    icon: Building2,
  },
  {
    label: 'Audit Logs',
    href: '/dashboard/audit-logs',
    icon: FileText,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  useEffect(() => {
    const activeParent = menuItems.find((item) => isActive(item.href));

    if (activeParent) {
      setExpandedMenu(activeParent.submenu ? activeParent.label : null);
    }
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <div className="p-1 bg-blue-600 rounded-lg">
              <img src="/RH.png" alt="Redemption House" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Redemption House</h1>
              <p className="text-xs text-gray-500">SMS Manager</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = !!item.submenu;
          const active =
            isActive(item.href) ||
            item.submenu?.some((subitem) => isActive(subitem.href));
          const submenuOpen = expandedMenu === item.label;

          return (
            <div key={item.label}>
              {hasSubmenu ? (
                <button
                  onClick={() => setExpandedMenu(submenuOpen ? null : item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      submenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )}

              {hasSubmenu && submenuOpen && (
                <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive(subitem.href)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2 cursor-pointer">
                <div className="p-1 bg-blue-600 rounded-lg">
                  <img src="/RH.png" alt="Redemption House" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Redemption House</h1>
                  <p className="text-xs text-gray-500">SMS Manager</p>
                </div>
              </Link>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900 cursor-pointer">Close</button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = !!item.submenu;
                const active =
                  isActive(item.href) ||
                  item.submenu?.some((subitem) => isActive(subitem.href));
                const submenuOpen = expandedMenu === item.label;

                return (
                  <div key={item.label}>
                          {hasSubmenu ? (
                            <button
                              onClick={() => setExpandedMenu(submenuOpen ? null : item.label)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                active
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              } cursor-pointer`}
                            >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${submenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link href={item.href!} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      } cursor-pointer`}>
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    )}

                    {hasSubmenu && submenuOpen && (
                      <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                        {item.submenu?.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={onClose}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive(subitem.href)
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            } cursor-pointer`}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
