'use client';

import { useEffect, useState } from 'react';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users as UsersIcon, Edit2, Save } from 'lucide-react';
import { churchAPI } from '@/lib/api';

interface Church {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChurchMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  groups: string[];
  joinDate: string;
}

export default function ChurchPage() {
  const { addNotification } = useNotificationsStore();
  const [church, setChurch] = useState<Church | null>(null);
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Church>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [churchResponse, membersResponse] = await Promise.all([
        churchAPI.getInfo(),
        churchAPI.getMembers(),
      ]);
      setChurch(churchResponse.data);
      setMembers(membersResponse.data.data);
      setEditData(churchResponse.data);
    } catch (error: any) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: 'Failed to load church data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await churchAPI.updateInfo(editData);
      setChurch(editData as Church);
      setEditing(false);
      addNotification({
        type: 'SUCCESS',
        title: 'Success',
        message: 'Church information updated',
      });
    } catch (error) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: 'Failed to update church information',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Church Management</h1>
        <p className="text-gray-600 mt-2">Manage your church information and members</p>
      </div>

      {/* Church Information */}
      {church && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{church.name}</h2>
                <p className="text-sm text-gray-600">{church.city}, {church.state}</p>
              </div>
            </div>
            <Button
              onClick={() => setEditing(!editing)}
              className={editing ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {editing ? 'Cancel' : <><Edit2 className="w-4 h-4 mr-2" />Edit</>}
            </Button>
          </div>

          {editing ? (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Church Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editData.email || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={editData.website || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editData.address || ''}
                  onChange={handleEditChange}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={editData.city || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={editData.state || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={editData.zipCode || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={editData.country || ''}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 border-t pt-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Email</p>
                <p className="text-gray-900 mt-1">{church.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Phone</p>
                <p className="text-gray-900 mt-1">{church.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Website</p>
                <p className="text-gray-900 mt-1">{church.website || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Address</p>
                <p className="text-gray-900 mt-1">{church.address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">City, State</p>
                <p className="text-gray-900 mt-1">{church.city}, {church.state} {church.zipCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Members</p>
                <p className="text-gray-900 mt-1">{church.memberCount}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Members */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="w-6 h-6 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900">Church Members ({members.length})</h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {members.length === 0 ? (
            <div className="p-8 text-center">
              <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No members yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Groups
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Join Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.groups.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {member.groups.map((group) => (
                              <span
                                key={group}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                              >
                                {group}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
