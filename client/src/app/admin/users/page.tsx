'use client';

import React from 'react';
import { withRole } from '@/hoc/withRole';
import { AdminLayout, useGetAllUsers } from '@/features/admin';
import { Card, Badge } from '@/common/components';
import { Users, Mail, Phone, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import { IUser } from '@/types';

function AdminUsersPage() {
  const { data: usersData, isLoading } = useGetAllUsers();
  const users: IUser[] = Array.isArray(usersData) ? usersData : usersData?.data || [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-600" /> Users Management ERP
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View all registered platform users, user types (`admin` vs `user`), and account statuses.
          </p>
        </div>
      </div>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading user database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100/80 text-slate-800 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Contact Email</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Account Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No registered user records found in database.
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => {
                    const fullName = u.firstName || u.lastName
                      ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                      : u.email?.split('@')[0] || 'User';

                    const formattedDate = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
                              {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{fullName}</div>
                              <span className="text-[11px] text-slate-500 font-medium block">
                                {u.userType === 'admin' ? 'System Administrator' : 'Machinery Buyer'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{u.email}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={u.userType === 'admin' ? 'warning' : 'primary'}
                            icon={u.userType === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          >
                            {u.userType?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={u.status === 'active' ? 'success' : 'error'}>
                            {u.status?.toUpperCase() || 'ACTIVE'}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500" suppressHydrationWarning>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}

export default withRole(AdminUsersPage, ['admin']);
