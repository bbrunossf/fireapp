import { Form } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { createTimeEntry } from '~/models/timeEntries';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const timeEntry = {
    employeeId: formData.get('employeeId') as string,
    projectId: formData.get('projectId') as string,
    taskId: formData.get('taskId') as string,
    date: new Date(formData.get('date') as string),
    hours: Number(formData.get('hours')),
    description: formData.get('description') as string,
  };

  await createTimeEntry(timeEntry);
  return redirect('/time-entries');
}

export default function NewTimeEntry() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Time Entry</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
            Hours
          </label>
          <input
            type="number"
            name="hours"
            id="hours"
            step="0.25"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Entry
          </button>
        </div>
      </Form>
    </div>
  );
}