'use client';

import { useState, useEffect } from 'react';
import { useSMSStore } from '@/lib/store/sms';
import { useNotificationsStore } from '@/lib/store/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface TemplateFormData {
  name: string;
  content: string;
  variables: string;
}

export default function TemplatesPage() {
  const { templates, fetchTemplates, addTemplate, updateTemplate, deleteTemplate, isLoading } = useSMSStore();
  const { addNotification } = useNotificationsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    content: '',
    variables: '',
  });

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.content) {
      addNotification({
        type: 'ERROR',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    const variables = formData.variables
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);

    try {
      if (editingId) {
        await updateTemplate(editingId, formData.name, formData.content, variables);
        addNotification({
          type: 'SUCCESS',
          title: 'Template Updated',
          message: `"${formData.name}" has been updated`,
        });
      } else {
        await addTemplate(formData.name, formData.content, variables);
        addNotification({
          type: 'SUCCESS',
          title: 'Template Created',
          message: `"${formData.name}" has been created`,
        });
      }
      resetForm();
    } catch (err) {
      addNotification({
        type: 'ERROR',
        title: 'Error',
        message: editingId ? 'Failed to update template' : 'Failed to create template',
      });
    }
  };

  const handleEdit = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setFormData({
        name: template.name,
        content: template.content,
        variables: template.variables.join(', '),
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
        addNotification({
          type: 'SUCCESS',
          title: 'Template Deleted',
          message: 'Template has been deleted',
        });
      } catch (err) {
        addNotification({
          type: 'ERROR',
          title: 'Error',
          message: 'Failed to delete template',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', content: '', variables: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SMS Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage reusable SMS templates</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Template' : 'Create New Template'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Template Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sunday Reminder"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium">
                Message Content
              </Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Type your message here..."
                disabled={isLoading}
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Characters: {formData.content.length}/320
              </p>
            </div>

            <div>
              <Label htmlFor="variables" className="text-sm font-medium">
                Variables (Optional)
              </Label>
              <Input
                id="variables"
                name="variables"
                value={formData.variables}
                onChange={handleChange}
                placeholder="e.g., NAME, DATE, TIME (comma-separated)"
                disabled={isLoading}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use these placeholders in your message like {'{NAME}'} or {'{DATE}'}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Update Template' : 'Create Template'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No templates yet. Create your first template!</p>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.content}</p>

              {template.variables.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {template.variables.map((v) => (
                    <span
                      key={v}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                    >
                      {'{' + v + '}'}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Button
                  size="sm"
                  onClick={() => handleEdit(template.id)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Tips for Templates</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Use variables for personalized messages: {'{NAME}'}, {'{DATE}'}, etc.</li>
          <li>✓ Keep messages concise - under 160 characters is ideal</li>
          <li>✓ Test your templates before using them in bulk sends</li>
        </ul>
      </div>
    </div>
  );
}
