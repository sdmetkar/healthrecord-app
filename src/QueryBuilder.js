import React, { useState, useEffect } from 'react';

const FIELDS = [
  { value: 'name', label: 'Name' },
  { value: 'dob', label: 'Date of Birth' },
  { value: 'gender', label: 'Gender' }
];
const OPS = [
  { value: 'eq', label: '=' },
  { value: 'ne', label: '≠' },
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'gte', label: '≥' },
  { value: 'lte', label: '≤' },
  { value: 'like', label: 'like' },
  { value: 'in', label: 'in' }
];
const LOGICS = [
  { value: 'and', label: 'AND' },
  { value: 'or', label: 'OR' },
  { value: 'not', label: 'NOT' }
];

function ConditionRow({ condition, onChange, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
      <select value={condition.field} onChange={e => onChange({ ...condition, field: e.target.value })}>
        <option value="">Field</option>
        {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <select value={condition.op} onChange={e => onChange({ ...condition, op: e.target.value })}>
        <option value="">Op</option>
        {OPS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input
        placeholder="Value"
        value={condition.value}
        onChange={e => onChange({ ...condition, value: e.target.value })}
        style={{ width: 120 }}
      />
      <button type="button" onClick={onDelete}>Delete</button>
    </div>
  );
}

function Group({ group, onChange, onDelete, showLogic = true }) {
  const handleCondChange = (idx, newCond) => {
    const newConds = group.conditions.slice();
    newConds[idx] = newCond;
    onChange({ ...group, conditions: newConds });
  };
  const handleCondDelete = idx => {
    const newConds = group.conditions.slice();
    newConds.splice(idx, 1);
    onChange({ ...group, conditions: newConds });
  };
  const addCond = () => {
    onChange({ ...group, conditions: [...group.conditions, { field: '', op: '', value: '' }] });
  };
  const addGroup = () => {
    onChange({ ...group, conditions: [...group.conditions, { logic: 'and', conditions: [] }] });
  };
  const handleLogicChange = e => {
    onChange({ ...group, logic: e.target.value });
  };
  return (
    <div style={{ border: '1px solid #aaa', padding: 8, marginBottom: 8, background: '#f9f9f9' }}>
      {showLogic && (
        <div style={{ marginBottom: 4 }}>
          <select value={group.logic} onChange={handleLogicChange}>
            {LOGICS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          {onDelete && <button type="button" onClick={onDelete} style={{ marginLeft: 8 }}>Delete Group</button>}
        </div>
      )}
      {group.conditions.map((cond, idx) =>
        cond.logic ? (
          <Group
            key={idx}
            group={cond}
            onChange={newGroup => handleCondChange(idx, newGroup)}
            onDelete={() => handleCondDelete(idx)}
            showLogic={true}
          />
        ) : (
          <ConditionRow
            key={idx}
            condition={cond}
            onChange={newCond => handleCondChange(idx, newCond)}
            onDelete={() => handleCondDelete(idx)}
          />
        )
      )}
      <div style={{ marginTop: 4 }}>
        <button type="button" className="main-btn" onClick={addCond}>Add Condition</button>
        <button type="button" className="main-btn secondary" onClick={addGroup} style={{ marginLeft: 8 }}>Add Group</button>
      </div>
    </div>
  );
}


export default function QueryBuilder({ value, onChange }) {
  // value is a JSON string or object
  const [root, setRoot] = useState(() => {
    if (value) {
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return { logic: 'and', conditions: [] };
      }
    }
    return { logic: 'and', conditions: [] };
  });

  // Keep root in sync with value prop
  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        setRoot(parsed);
      } catch {
        setRoot({ logic: 'and', conditions: [] });
      }
    } else {
      setRoot({ logic: 'and', conditions: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Helper to check if node is a group
  const isGroup = node => node && node.logic && Array.isArray(node.conditions);

  const handleRootChange = newRoot => {
    setRoot(newRoot);
    // If root is a group with only one condition and no nested group, flatten to simple condition
    if (
      newRoot &&
      newRoot.logic &&
      Array.isArray(newRoot.conditions) &&
      newRoot.conditions.length === 1 &&
      !newRoot.conditions[0].logic
    ) {
      // Only one simple condition, return just the condition (no logic)
      onChange(JSON.stringify(newRoot.conditions[0]));
    } else if (
      newRoot &&
      newRoot.logic &&
      Array.isArray(newRoot.conditions) &&
      newRoot.conditions.length === 0
    ) {
      // Empty group, return empty string
      onChange('');
    } else {
      onChange(JSON.stringify(newRoot));
    }
  };

  // If root is a group, render as group (hide logic selector for root group). If not, render as a single condition.
  return (
    <div>
      {isGroup(root) ? (
        <Group group={root} onChange={handleRootChange} showLogic={false} />
      ) : (
        <div style={{ border: '1px solid #aaa', padding: 8, marginBottom: 8, background: '#f9f9f9' }}>
          <ConditionRow
            condition={root}
            onChange={handleRootChange}
            onDelete={() => handleRootChange({ field: '', op: '', value: '' })}
          />
          <button type="button" onClick={() => handleRootChange({ logic: 'and', conditions: [root] })}>
            Convert to Group
          </button>
        </div>
      )}
    </div>
  );
}
