import React, { useEffect, useState } from 'react';
import { mockMealService } from '../mock/mockMealService';
import { ClassRoster, MealDemand, InspectionRecord, TrayDistribution, ReconciliationReport } from '../mock/types';

export function useMealOperations() {
  const [rosters, setRosters] = useState<ClassRoster[]>(mockMealService.getRosters());
  const [demand, setDemand] = useState<MealDemand>(mockMealService.getMealDemand());
  const [inspection, setInspection] = useState<InspectionRecord>(mockMealService.getInspection());
  const [distributions, setDistributions] = useState<TrayDistribution[]>(mockMealService.getDistributions());
  const [reconciliation, setReconciliation] = useState<ReconciliationReport>(mockMealService.getReconciliationReport());

  useEffect(() => {
    const unsubscribe = mockMealService.subscribe(() => {
      setRosters([...mockMealService.getRosters()]);
      setDemand({ ...mockMealService.getMealDemand() });
      setInspection({ ...mockMealService.getInspection() });
      setDistributions([...mockMealService.getDistributions()]);
      setReconciliation({ ...mockMealService.getReconciliationReport() });
    });
    return unsubscribe;
  }, []);

  return {
    rosters,
    demand,
    inspection,
    distributions,
    reconciliation,
    updateStudentStatus: mockMealService.updateStudentStatus.bind(mockMealService),
    toggleLockClassRoster: mockMealService.toggleLockClassRoster.bind(mockMealService),
    lockAllAttendance: mockMealService.lockAllAttendance.bind(mockMealService),
    setBufferPercentage: mockMealService.setBufferPercentage.bind(mockMealService),
    submitOrderToCatering: mockMealService.submitOrderToCatering.bind(mockMealService),
    updateInspection: mockMealService.updateInspection.bind(mockMealService),
    confirmTrayDelivery: mockMealService.confirmTrayDelivery.bind(mockMealService),
    finalizeReconciliation: mockMealService.finalizeReconciliation.bind(mockMealService),
  };
}
