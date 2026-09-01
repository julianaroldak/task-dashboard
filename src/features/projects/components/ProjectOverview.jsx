import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectOverview({ project }) {
  // Calculate construction costs
  const aboveGroundCost = 6500 * 1400; // 9,100,000
  const belowGroundCost = 2000 * 400;   // 800,000
  const directCosts = aboveGroundCost + belowGroundCost; // 9,900,000
  const indirectCosts = directCosts * 0.17; // 1,683,000
  const totalConstructionCosts = directCosts + indirectCosts; // 11,583,000

  const sections = [
    {
      title: '📍 Project Details',
      items: [
        { label: 'Name', value: project.name },
        { label: 'Location', value: project.location },
        { label: 'Investor Profile', value: project.investorProfile },
        { label: 'Disinvestment Strategy', value: project.disinvestmentStrategy },
      ],
    },
    {
      title: '🏗️ Construction Specs',
      items: [
        { label: 'Total Apartments', value: '40' },
        { label: 'Above Ground (m²)', value: '6,500' },
        { label: 'Below Ground (m²)', value: '2,000' },
        { label: 'T2 Units', value: '10' },
        { label: 'T3 Units', value: '15' },
        { label: 'T4 Units', value: '15' },
      ],
    },
    {
      title: '💰 Cost Breakdown',
      items: [
        {
          label: 'Direct Costs (Above Ground)',
          value: `€${aboveGroundCost.toLocaleString('pt-PT')}`,
          detail: '6,500 m² × €1,400/m²',
        },
        {
          label: 'Direct Costs (Below Ground)',
          value: `€${belowGroundCost.toLocaleString('pt-PT')}`,
          detail: '2,000 m² × €400/m²',
        },
        {
          label: 'Total Direct Costs',
          value: `€${directCosts.toLocaleString('pt-PT')}`,
          highlight: true,
        },
        {
          label: 'Indirect Costs (17%)',
          value: `€${indirectCosts.toLocaleString('pt-PT')}`,
        },
        {
          label: 'Total Construction Costs',
          value: `€${totalConstructionCosts.toLocaleString('pt-PT')}`,
          highlight: true,
        },
      ],
    },
    {
      title: '💳 Financing Structure',
      items: [
        { label: 'Owner Capital', value: `€${parseInt(project.ownerCapital || 15000000).toLocaleString('pt-PT')}` },
        { label: 'Land Financing (max 25%)', value: 'Up to 25% of acquisition' },
        { label: 'Construction Financing (max 50%)', value: '50% of direct & indirect costs' },
        { label: 'Financing Rate', value: 'Euribor 6M (2.5364%) + 2.5% spread = 5.0364%' },
      ],
    },
    {
      title: '📊 Financial Metrics',
      items: [
        { label: 'Expected Sales Value', value: `€${parseInt(project.projectValue || 26726471).toLocaleString('pt-PT')}` },
        { label: 'Expected Project IRR', value: 'Pending validation' },
        { label: 'Expected Equity IRR', value: 'Pending validation' },
        { label: 'Tax Rate', value: '31.50%' },
      ],
    },
    {
      title: '⚠️ Data Validation Notes',
      items: [
        { 
          label: 'Issue 1', 
          value: 'Excel shows 50% land financing vs 25% in specification',
          status: 'needs-fix'
        },
        { 
          label: 'Issue 2', 
          value: 'Excel uses Euribor 3M + 2% vs Euribor 6M + 2.5%',
          status: 'needs-fix'
        },
        { 
          label: 'Issue 3', 
          value: 'Commission shown as 6% vs 7.38% (6% + IVA)',
          status: 'needs-fix'
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {section.title}
          </h3>

          <div className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className={`flex justify-between items-start py-2 px-3 rounded-lg ${
                  item.status === 'needs-fix'
                    ? 'bg-red-50 border border-red-200'
                    : item.highlight
                    ? 'bg-blue-50 border border-blue-200'
                    : 'border-b border-slate-200'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-700">{item.label}</p>
                  {item.detail && (
                    <p className="text-sm text-slate-500 mt-1">{item.detail}</p>
                  )}
                </div>
                <p
                  className={`font-bold text-right ${
                    item.status === 'needs-fix'
                      ? 'text-red-600'
                      : item.highlight
                      ? 'text-blue-600'
                      : 'text-slate-900'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
