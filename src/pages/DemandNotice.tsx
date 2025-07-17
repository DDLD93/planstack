import React, { useState } from "react";
import { Card } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Mail, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";

// StatCard Component (from Operations.tsx)
const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </div>
);

const propertyOwners = [
  { id: 1, name: "John Adamu", propertyId: "JN-12345", phone: "08012345678", price: 50000 },
  { id: 2, name: "Jane Musa", propertyId: "JS-54321", phone: "08023456789", price: 120000 },
  { id: 3, name: "Ali Bello", propertyId: "MG-67890", phone: "08034567890", price: 80000 },
  { id: 4, name: "Grace Obi", propertyId: "BK-11223", phone: "08045678901", price: 70000 },
  { id: 5, name: "Samuel Okoro", propertyId: "KN-33445", phone: "08056789012", price: 95000 },
  { id: 6, name: "Fatima Sani", propertyId: "KT-55667", phone: "08067890123", price: 60000 },
  { id: 7, name: "Peter Eze", propertyId: "EN-77889", phone: "08078901234", price: 110000 },
  { id: 8, name: "Ngozi Uche", propertyId: "AB-99001", phone: "08089012345", price: 105000 },
  { id: 9, name: "Bola Tinubu", propertyId: "LA-11223", phone: "08090123456", price: 130000 },
  { id: 10, name: "Aisha Buhari", propertyId: "FC-22334", phone: "08012349876", price: 90000 },
  { id: 11, name: "Chinedu Obi", propertyId: "AN-33445", phone: "08023456781", price: 75000 },
  { id: 12, name: "Maryam Abubakar", propertyId: "KD-44556", phone: "08034567812", price: 115000 },
  { id: 13, name: "Ibrahim Musa", propertyId: "KN-55667", phone: "08045678123", price: 98000 },
  { id: 14, name: "Blessing Okafor", propertyId: "IM-66778", phone: "08056781234", price: 102000 },
  { id: 15, name: "Emeka Nwosu", propertyId: "EB-77889", phone: "08067812345", price: 87000 },
  { id: 16, name: "Halima Yusuf", propertyId: "SO-88990", phone: "08078123456", price: 108000 },
  { id: 17, name: "Tunde Bakare", propertyId: "OG-99001", phone: "08081234567", price: 125000 },
  { id: 18, name: "Rita Dominic", propertyId: "CR-10112", phone: "08092345678", price: 112000 },
  { id: 19, name: "Yakubu Dogara", propertyId: "BO-21223", phone: "08013456789", price: 97000 },
  { id: 20, name: "Funke Akindele", propertyId: "OS-32334", phone: "08024567891", price: 99000 },
];

const templates = {
  "Demand Notice":
    "Dear {{name}},\n\nThis is a demand notice for your property (ID: {{propertyId}}). Your outstanding charge is ₦{{price}}. Please settle your outstanding charges promptly.\n\nThank you.",
  "Land Use Charge":
    "Dear {{name}},\n\nThis is a notice regarding your Land Use Charge for property (ID: {{propertyId}}). The amount due is ₦{{price}}. Kindly ensure payment is made to avoid penalties.\n\nThank you.",
};

const analytics = {
  totalNotices: 20,
  totalOutstanding: propertyOwners.reduce((sum, o) => sum + o.price, 0),
  paid: 7,
  unpaid: 13,
  noticesByMonth: [
    { month: "Jan", issued: 5 },
    { month: "Feb", issued: 7 },
    { month: "Mar", issued: 8 },
  ],
};

const DemandNotice = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<"Demand Notice" | "Land Use Charge">("Demand Notice");
  const [selectedOwners, setSelectedOwners] = useState<number[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [previewOwnerId, setPreviewOwnerId] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  const handleOwnerToggle = (id: number) => {
    setSelectedOwners((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const getMessage = (owner: typeof propertyOwners[0]) => {
    let template = customMessage || templates[selectedTemplate];
    return template
      .replace(/{{name}}/g, owner.name)
      .replace(/{{propertyId}}/g, owner.propertyId)
      .replace(/{{price}}/g, owner.price.toLocaleString());
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Mail className="mr-2 text-blue-500" /> Demand Notice Center
      </h1>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Notices" value={analytics.totalNotices} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Total Outstanding" value={`₦${analytics.totalOutstanding.toLocaleString()}`} icon={<DollarSign className="w-5 h-5 text-green-500" />} />
        <StatCard title="Paid" value={analytics.paid} icon={<CheckCircle className="w-5 h-5 text-yellow-500" />} />
        <StatCard title="Unpaid" value={analytics.unpaid} icon={<XCircle className="w-5 h-5 text-red-500" />} />
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-indigo-500" /> Notices Issued by Month
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics.noticesByMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="issued" fill="#3B82F6" name="Issued" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-6">Send Bulk Notice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Select Template:</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
            >
              <option value="Demand Notice">Demand Notice</option>
              <option value="Land Use Charge">Land Use Charge</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Custom Message (optional):</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={templates[selectedTemplate]}
            />
            <div className="text-xs text-gray-500 mt-1">
              Use <code>{"{{name}}"}</code>, <code>{"{{propertyId}}"}</code>, and <code>{"{{price}}"}</code> as placeholders.
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Property ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Outstanding (₦)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {propertyOwners.map((owner) => (
                <tr key={owner.id} className={selectedOwners.includes(owner.id) ? "bg-blue-50" : "hover:bg-gray-50"}>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedOwners.includes(owner.id)}
                      onChange={() => handleOwnerToggle(owner.id)}
                    />
                  </td>
                  <td className="px-3 py-2 font-medium">{owner.name}</td>
                  <td className="px-3 py-2">{owner.propertyId}</td>
                  <td className="px-3 py-2">{owner.phone}</td>
                  <td className="px-3 py-2">{owner.price.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewOwnerId(owner.id)}
                      disabled={!selectedOwners.includes(owner.id)}
                      className="rounded"
                    >
                      Preview
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={handleSend}
            disabled={selectedOwners.length === 0}
            variant="default"
            className="px-6 py-2 rounded shadow-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Send Message
          </Button>
        </div>
        {sent && (
          <div className="mt-4 text-green-600 font-semibold">Messages sent successfully!</div>
        )}
      </div>
      {previewOwnerId && (
        <Card className="p-6 mt-4 max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Message Preview</h2>
          {(() => {
            const owner = propertyOwners.find((o) => o.id === previewOwnerId);
            if (!owner) return null;
            return (
              <>
                <div className="font-semibold mb-2">To: {owner.name} ({owner.phone})</div>
                <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap mb-4">{getMessage(owner)}</pre>
                <Button onClick={() => setPreviewOwnerId(null)} variant="outline">Close Preview</Button>
              </>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default DemandNotice; 