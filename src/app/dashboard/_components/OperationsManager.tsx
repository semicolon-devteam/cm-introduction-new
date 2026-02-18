"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Server,
  AlertTriangle,
  Activity,
  Wrench,
} from "lucide-react";
import type { OperationsData, IncidentItem, InfraChangeItem } from "./types";
import { SERVICE_STATUS, INCIDENT_STATUS, INFRA_CHANGE_TYPE } from "./types";

interface OperationsManagerProps {
  operations: OperationsData;
  onSave: (operations: OperationsData) => void;
}

export function OperationsManager({ operations, onSave }: OperationsManagerProps) {
  const [editingIncident, setEditingIncident] = useState<string | null>(null);
  const [editingInfra, setEditingInfra] = useState<string | null>(null);
  const [incidentForm, setIncidentForm] = useState<IncidentItem | null>(null);
  const [infraForm, setInfraForm] = useState<InfraChangeItem | null>(null);

  // === 인시던트 관련 ===
  const addIncident = () => {
    const newIncident: IncidentItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      description: "",
      status: "investigating",
    };
    setEditingIncident(newIncident.id);
    setIncidentForm(newIncident);
    onSave({ ...operations, incidents: [...operations.incidents, newIncident] });
  };

  const saveIncident = () => {
    if (!incidentForm) return;
    onSave({
      ...operations,
      incidents: operations.incidents.map((i) => (i.id === incidentForm.id ? incidentForm : i)),
    });
    setEditingIncident(null);
    setIncidentForm(null);
  };

  const cancelIncident = () => {
    if (incidentForm && !incidentForm.description) {
      onSave({
        ...operations,
        incidents: operations.incidents.filter((i) => i.id !== incidentForm.id),
      });
    }
    setEditingIncident(null);
    setIncidentForm(null);
  };

  const deleteIncident = (id: string) => {
    if (confirm("이 인시던트를 삭제하시겠습니까?")) {
      onSave({ ...operations, incidents: operations.incidents.filter((i) => i.id !== id) });
    }
  };

  // === 인프라 변경 관련 ===
  const addInfraChange = () => {
    const newChange: InfraChangeItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "other",
    };
    setEditingInfra(newChange.id);
    setInfraForm(newChange);
    onSave({ ...operations, infraChanges: [...operations.infraChanges, newChange] });
  };

  const saveInfra = () => {
    if (!infraForm) return;
    onSave({
      ...operations,
      infraChanges: operations.infraChanges.map((c) => (c.id === infraForm.id ? infraForm : c)),
    });
    setEditingInfra(null);
    setInfraForm(null);
  };

  const cancelInfra = () => {
    if (infraForm && !infraForm.description) {
      onSave({
        ...operations,
        infraChanges: operations.infraChanges.filter((c) => c.id !== infraForm.id),
      });
    }
    setEditingInfra(null);
    setInfraForm(null);
  };

  const deleteInfra = (id: string) => {
    if (confirm("이 인프라 변경 사항을 삭제하시겠습니까?")) {
      onSave({ ...operations, infraChanges: operations.infraChanges.filter((c) => c.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      {/* 서비스 상태 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            서비스 상태
          </h2>
        </div>
        <div className="p-5">
          <div className="flex gap-2">
            {(Object.keys(SERVICE_STATUS) as Array<keyof typeof SERVICE_STATUS>).map((status) => (
              <button
                key={status}
                onClick={() => onSave({ ...operations, serviceStatus: status })}
                className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                  operations.serviceStatus === status
                    ? `${SERVICE_STATUS[status].bg} border-transparent text-white`
                    : "bg-[#25262b] border-[#373A40] text-[#909296] hover:border-[#5c5f66]"
                }`}
              >
                <div
                  className={`text-sm font-medium ${operations.serviceStatus === status ? "text-white" : SERVICE_STATUS[status].color}`}
                >
                  {SERVICE_STATUS[status].label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메트릭스 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            운영 지표
          </h2>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#909296] mb-1.5">업타임 (%)</label>
            <input
              type="text"
              value={operations.metrics.uptime}
              onChange={(e) =>
                onSave({
                  ...operations,
                  metrics: { ...operations.metrics, uptime: e.target.value },
                })
              }
              placeholder="99.9"
              className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#909296] mb-1.5">
              응답 시간 (ms)
            </label>
            <input
              type="text"
              value={operations.metrics.responseTime}
              onChange={(e) =>
                onSave({
                  ...operations,
                  metrics: { ...operations.metrics, responseTime: e.target.value },
                })
              }
              placeholder="150"
              className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#909296] mb-1.5">에러율 (%)</label>
            <input
              type="text"
              value={operations.metrics.errorRate}
              onChange={(e) =>
                onSave({
                  ...operations,
                  metrics: { ...operations.metrics, errorRate: e.target.value },
                })
              }
              placeholder="0.1"
              className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#909296] mb-1.5">활성 사용자</label>
            <input
              type="text"
              value={operations.metrics.activeUsers}
              onChange={(e) =>
                onSave({
                  ...operations,
                  metrics: { ...operations.metrics, activeUsers: e.target.value },
                })
              }
              placeholder="1250"
              className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 인시던트 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            인시던트
          </h2>
          <button
            onClick={addIncident}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>
        <div className="p-5">
          {operations.incidents.length === 0 ? (
            <p className="text-center text-[#5c5f66] text-sm py-4">등록된 인시던트가 없습니다</p>
          ) : (
            <div className="space-y-2">
              {operations.incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-[#25262b] rounded-lg border border-[#373A40] p-3"
                >
                  {editingIncident === incident.id && incidentForm ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={incidentForm.date}
                          onChange={(e) =>
                            setIncidentForm({ ...incidentForm, date: e.target.value })
                          }
                          className="h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        />
                        <select
                          value={incidentForm.status}
                          onChange={(e) =>
                            setIncidentForm({
                              ...incidentForm,
                              status: e.target.value as IncidentItem["status"],
                            })
                          }
                          className="h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        >
                          {Object.entries(INCIDENT_STATUS).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={incidentForm.description}
                        onChange={(e) =>
                          setIncidentForm({ ...incidentForm, description: e.target.value })
                        }
                        placeholder="인시던트 설명"
                        className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelIncident}
                          className="h-8 px-3 text-sm text-[#909296] hover:text-white rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={saveIncident}
                          disabled={!incidentForm.description}
                          className="h-8 px-3 text-sm text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#909296]">{incident.date}</span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${INCIDENT_STATUS[incident.status].color}`}
                          >
                            {INCIDENT_STATUS[incident.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-white mt-1">
                          {incident.description || "(설명 없음)"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingIncident(incident.id);
                            setIncidentForm({ ...incident });
                          }}
                          className="p-1.5 text-[#909296] hover:text-white rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteIncident(incident.id)}
                          className="p-1.5 text-[#909296] hover:text-red-400 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 인프라 변경 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-400" />
            인프라 변경
          </h2>
          <button
            onClick={addInfraChange}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>
        <div className="p-5">
          {operations.infraChanges.length === 0 ? (
            <p className="text-center text-[#5c5f66] text-sm py-4">
              등록된 인프라 변경 사항이 없습니다
            </p>
          ) : (
            <div className="space-y-2">
              {operations.infraChanges.map((change) => (
                <div
                  key={change.id}
                  className="bg-[#25262b] rounded-lg border border-[#373A40] p-3"
                >
                  {editingInfra === change.id && infraForm ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={infraForm.date}
                          onChange={(e) => setInfraForm({ ...infraForm, date: e.target.value })}
                          className="h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        />
                        <select
                          value={infraForm.type}
                          onChange={(e) =>
                            setInfraForm({
                              ...infraForm,
                              type: e.target.value as InfraChangeItem["type"],
                            })
                          }
                          className="h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        >
                          {Object.entries(INFRA_CHANGE_TYPE).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={infraForm.description}
                        onChange={(e) =>
                          setInfraForm({ ...infraForm, description: e.target.value })
                        }
                        placeholder="변경 사항 설명"
                        className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelInfra}
                          className="h-8 px-3 text-sm text-[#909296] hover:text-white rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={saveInfra}
                          disabled={!infraForm.description}
                          className="h-8 px-3 text-sm text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#909296]">{change.date}</span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${INFRA_CHANGE_TYPE[change.type].color}`}
                          >
                            {INFRA_CHANGE_TYPE[change.type].label}
                          </span>
                        </div>
                        <p className="text-sm text-white mt-1">
                          {change.description || "(설명 없음)"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingInfra(change.id);
                            setInfraForm({ ...change });
                          }}
                          className="p-1.5 text-[#909296] hover:text-white rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInfra(change.id)}
                          className="p-1.5 text-[#909296] hover:text-red-400 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 비고 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40]">
          <h2 className="text-base font-semibold text-white">운영 메모</h2>
        </div>
        <div className="p-5">
          <textarea
            value={operations.notes}
            onChange={(e) => onSave({ ...operations, notes: e.target.value })}
            placeholder="운영 관련 메모..."
            rows={3}
            className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
}
