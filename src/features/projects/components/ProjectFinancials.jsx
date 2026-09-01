import React, { useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext';
import { motion } from 'framer-motion';

export default function ProjectFinancials({ project }) {
  const { updateFinancials } = useProjectContext();
  const [editMode, setEditMode] = useState(false);
  const [financials, setFinancials] = useState(project.financials || {});

  // Calculate base values from specifications
  const calculations = {
    aboveGroundArea: 6500,
    belowGroundArea: 2000,
    aboveGroundCostPerM2: 1400,
    belowGroundCostPerM2: 400,
    indirectCostPercentage: 0.17,
    landFinancingMax: 0.25,
    constructionFinancingMax: 0.50,
    salesCommissionRate: 0.0738, // 6% + IVA = 7.38%
    euriborRate: 0.025364, // Euribor 6M average May 2026
    bankSpread: 0.025,
    taxRate: 0.315,
  };

  // Direct costs
  const directCosts = {
    aboveGround: calculations.aboveGroundArea * calculations.aboveGroundCostPerM2,
    belowGround: calculations.belowGroundArea * calculations.belowGroundCostPerM2,
  };
  directCosts.total = directCosts.aboveGround + directCosts.belowGround;

  // Indirect costs
  const indirectCosts = directCosts.total * calculations.indirectCostPercentage;
  const totalConstructionCosts = directCosts.total + indirectCosts;

  // Financing costs
  const financingCosts = {
    landFinancingMaxPercent: calculations.landFinancingMax,
    constructionFinancingMaxPercent: calculations.constructionFinancingMax,
    financingRate: calculations.euriborRate + calculations.bankSpread,
  };

  // Sales and revenue
  const apartmentPrices = {
    T2: 4700,
    T3: 4250,
    T4: 4000,
  };
  const units = { T2: 10, T3: 15, T4: 15 };
  const totalSalesValue =
    apartmentPrices.T2 * units.T2 * (6500 / 40) +
    apartmentPrices.T3 * units.T3 * (6500 / 40) +
    apartmentPrices.T4 * units.T4 * (6500 / 40);

  const salesCommission = totalSalesValue * calculations.salesCommissionRate;

  const handleSaveFinancials = () => {
    updateFinancials(project.id, financials);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">💸 Cost Breakdown</h3>

        <div className="space-y-3">
          {/* Direct Costs */}
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">Direct Costs</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-700">Above Ground (6,500 m² × €1,400)</span>
                <span className="font-semibold">
                  €{directCosts.aboveGround.toLocaleString('pt-PT')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Below Ground (2,000 m² × €400)</span>
                <span className="font-semibold">
                  €{directCosts.belowGround.toLocaleString('pt-PT')}
                </span>
              </div>
              <div className="border-t border-red-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total Direct Costs</span>
                <span className="text-red-600">€{directCosts.total.toLocaleString('pt-PT')}</span>
              </div>
            </div>
          </div>

          {/* Indirect Costs */}
          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">
              Indirect Costs (17% of Direct)
            </h4>
            <div className="space-y-2">
              <div className="text-sm text-slate-600 mb-2">
                Includes: Design, permits, inspections, insurance, project management
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Indirect Costs</span>
                <span className="text-orange-600">€{indirectCosts.toLocaleString('pt-PT')}</span>
              </div>
            </div>
          </div>

          {/* Total Construction */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-lg">
            <div className="flex justify-between font-bold text-xl">
              <span>Total Construction Costs</span>
              <span>€{totalConstructionCosts.toLocaleString('pt-PT')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Financing Structure */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">🏦 Financing Structure</h3>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">Owner Capital</h4>
            <p className="text-2xl font-bold text-blue-600">
              €{parseInt(project.ownerCapital || 15000000).toLocaleString('pt-PT')}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Available for land acquisition and construction coverage
            </p>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">Bank Financing</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Land Financing</span>
                <span className="font-semibold">Up to 25% of acquisition cost</span>
              </div>
              <div className="flex justify-between">
                <span>Construction Financing</span>
                <span className="font-semibold">Up to 50% of construction costs</span>
              </div>
              <div className="border-t border-cyan-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Financing Rate</span>
                <span className="text-cyan-600">
                  {(financingCosts.financingRate * 100).toFixed(4)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Euribor 6M (2.5364%) + Bank Spread (2.5%)
              </p>
            </div>
          </div>
        </div>

        {/* Data Validation */}
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <h4 className="font-bold text-red-900 mb-2">⚠️ Financing Discrepancies</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>✗ Excel uses 50% land financing (should be 25%)</li>
            <li>✗ Excel uses Euribor 3M + 2% (should be Euribor 6M + 2.5%)</li>
            <li>✓ Correct financing rate: 5.0364% p.a.</li>
          </ul>
        </div>
      </motion.div>

      {/* Sales & Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">📊 Sales & Revenue</h3>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-4">Apartment Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(units).map(([type, count]) => (
                <div key={type} className="text-center">
                  <p className="text-2xl font-bold text-green-600">{count}</p>
                  <p className="text-sm text-slate-600">{type} Units</p>
                  <p className="text-xs text-slate-500 mt-1">
                    €{apartmentPrices[type]}/m²
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">Total Sales Value</h4>
            <p className="text-3xl font-bold text-emerald-600">
              €{(parseInt(project.projectValue || 26726471)).toLocaleString('pt-PT')}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Estimated revenue from 40 apartment sales
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-bold text-slate-900 mb-3">
              Sales Commission (7.38% = 6% + IVA)
            </h4>
            <p className="text-2xl font-bold text-yellow-600">
              €{(salesCommission).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Commercialization and marketing costs
            </p>
          </div>
        </div>

        {/* Data Validation */}
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <h4 className="font-bold text-red-900 mb-2">⚠️ Commission Issue</h4>
          <p className="text-sm text-red-800">
            Excel profitability sheet shows 6% commission instead of 7.38% (6% + IVA).
            This underestimates costs.
          </p>
        </div>
      </motion.div>

      {/* Financial Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">📈 Financial Metrics</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {editMode ? 'Cancel' : 'Edit Metrics'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Project IRR (Expected)', key: 'projectIRR', value: '~10-12%', status: 'pending-validation' },
            { label: 'Equity IRR (Expected)', key: 'equityIRR', value: '~18-22%', status: 'pending-validation' },
            { label: 'Project NPV', key: 'projectNPV', value: '€1.4M+', status: 'pending-validation' },
            { label: 'Profit Margin', key: 'profitMargin', value: 'TBD', status: 'pending-calculation' },
          ].map(metric => (
            <div key={metric.key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
              <p className={`text-2xl font-bold mt-2 ${
                metric.status === 'pending-validation' ? 'text-amber-600' : 'text-slate-600'
              }`}>
                {metric.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {metric.status === 'pending-validation' ? '⏳ Awaiting Excel validation' : 'Pending calculation'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <h4 className="font-bold text-amber-900 mb-2">🔍 Pending Validations</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>✗ Correct Excel financing assumptions (land & construction)</li>
            <li>✗ Update financing rate to 5.0364%</li>
            <li>✗ Verify sales commission as 7.38%</li>
            <li>✗ Recalculate Project IRR, Equity IRR, and NPV</li>
          </ul>
        </div>
      </motion.div>

      {/* Risk Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">⚠️ Risk Assessment</h3>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Investment Profile</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-slate-900">Value Added Strategy</p>
                  <p className="text-sm text-slate-600">Medium-High Risk, Higher Returns</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Focus on value creation through development, construction, and resale. Relies on
                market conditions and successful commercialization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">Moody's Rating</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">A3</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-purple-900">ERP (Equity Risk Premium)</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">5.78%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
