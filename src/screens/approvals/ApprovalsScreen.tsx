import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  Button,
  EmptyView,
  LoadingView,
  SegmentedTabs,
} from '../../components';
import { approvalService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { colors } from '../../theme/colors';
import { formatAmount } from '../../utils/format';
import {
  ApproveIcon,
  HistoryIcon,
  ReferBackIcon,
  RejectIcon,
  ViewIcon,
  type IconProps,
} from '../../components/icons/ActionIcons';
import type { ApprovalColumn, ApprovalRecord, ApprovalTable } from '../../types';

/* ── Layout constants for the table ──────────────────────────────────────── */

const CHEVRON_W = 40; // expand toggle column
const CHECK_W = 44; // selection checkbox column
const ACTIONS_W = 250; // trailing actions column (5 icon buttons)
const ROW_H = 56;

/* ── Row actions (mirror the web action toolbar) ─────────────────────────── */

interface ActionDef {
  key: string;
  label: string;
  Icon: React.ComponentType<IconProps>;
  /** Border tint for the icon button box. */
  borderClass: string;
}

const ROW_ACTIONS: ActionDef[] = [
  { key: 'history', label: 'History', Icon: HistoryIcon, borderClass: 'border-gray-300' },
  { key: 'reject', label: 'Reject', Icon: RejectIcon, borderClass: 'border-red-300' },
  { key: 'approve', label: 'Approve', Icon: ApproveIcon, borderClass: 'border-green-300' },
  { key: 'refer-back', label: 'Refer Back', Icon: ReferBackIcon, borderClass: 'border-amber-300' },
  { key: 'view', label: 'View', Icon: ViewIcon, borderClass: 'border-blue-300' },
];

/** Renders a single cell's content based on its column type. */
function Cell({ col, value }: { col: ApprovalColumn; value: string | number }) {
  if (col.type === 'avatar') {
    const name = String(value ?? '');
    return (
      <View className="flex-row items-center">
        <Avatar name={name || '?'} size={28} />
        <Text className="ml-2 flex-1 text-sm text-ink" numberOfLines={1}>
          {name}
        </Text>
      </View>
    );
  }
  if (col.type === 'amount') {
    return (
      <Text className="text-sm text-ink">{formatAmount(Number(value) || 0)}</Text>
    );
  }
  return (
    <Text className="text-sm text-ink" numberOfLines={1}>
      {value === '' || value == null ? '' : String(value)}
    </Text>
  );
}

/* ── Screen ──────────────────────────────────────────────────────────────── */

export function ApprovalsScreen() {
  const insets = useSafeAreaInsets();
  const tabs = useAsync(approvalService.getTabs);
  const [activeKey, setActiveKey] = useState<string>('non-standard-earnings-process');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [columnsModal, setColumnsModal] = useState(false);

  // Grid re-fetches whenever the active tab changes. (useAsync runs on mount
  // only, so the tab-driven reload is managed here directly.)
  const [table, setTable] = useState<ApprovalTable>({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    approvalService
      .getApprovals(activeKey)
      .then(data => {
        if (active) setTable(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeKey]);

  const activeTab = (tabs.data ?? []).find(t => t.key === activeKey);
  const tabTitle = activeTab ? `${activeTab.label} Approvals` : 'Approvals';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return table.rows;
    return table.rows.filter(r =>
      Object.values(r.cells).join(' ').toLowerCase().includes(q),
    );
  }, [table.rows, query]);

  const visibleColumns = useMemo(
    () => table.columns.filter(c => !hiddenCols.has(c.key)),
    [table.columns, hiddenCols],
  );

  const totalWidth =
    CHEVRON_W +
    CHECK_W +
    visibleColumns.reduce((sum, c) => sum + c.width, 0) +
    ACTIONS_W;

  const onChangeTab = (key: string) => {
    setActiveKey(key);
    setQuery('');
    setSelected(new Set());
    setExpanded(null);
    setHiddenCols(new Set());
  };

  const toggleColumn = (key: string) => {
    setHiddenCols(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  const toggleSelectAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach(r => next.delete(r.id));
      } else {
        filtered.forEach(r => next.add(r.id));
      }
      return next;
    });
  };

  const onRowAction = (label: string, row: ApprovalRecord) => {
    Alert.alert(label, `${label} — ${row.cells.transactionNo ?? row.id}`);
  };

  const onBulk = (label: string) => {
    Alert.alert(label, `${selected.size} item(s) selected.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => setSelected(new Set()) },
    ]);
  };

  const selectedCount = selected.size;

  /* Header row of the table (sticky to the table, scrolls horizontally). */
  const HeaderRow = (
    <View
      className="flex-row items-center border-b border-surface-border bg-surface-muted"
      style={{ height: 44 }}>
      <View style={{ width: CHEVRON_W }} />
      <View style={{ width: CHECK_W }} className="items-center justify-center">
        <Pressable
          hitSlop={8}
          onPress={toggleSelectAll}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allSelected }}
          className={`h-5 w-5 items-center justify-center rounded border ${
            allSelected ? 'border-brand-600 bg-brand-600' : 'border-ink-faint bg-white'
          }`}>
          {allSelected ? <Text className="text-[10px] font-bold text-white">✓</Text> : null}
        </Pressable>
      </View>
      {visibleColumns.map(col => (
        <View key={col.key} style={{ width: col.width }} className="px-3">
          <Text
            className="text-xs font-bold text-ink-muted"
            numberOfLines={1}>
            {col.label} <Text className="text-ink-faint">▾</Text>
          </Text>
        </View>
      ))}
      <View style={{ width: ACTIONS_W }} className="px-3">
        <Text className="text-xs font-bold text-ink-muted">Actions</Text>
      </View>
    </View>
  );

  const renderRow = (row: ApprovalRecord) => {
    const isSelected = selected.has(row.id);
    const isExpanded = expanded === row.id;
    return (
      <View key={row.id} className="border-b border-surface-border">
        <View
          className={`flex-row items-center ${isSelected ? 'bg-brand-50' : 'bg-white'}`}
          style={{ height: ROW_H }}>
          {/* expand toggle */}
          <View style={{ width: CHEVRON_W }} className="items-center justify-center">
            <Pressable
              hitSlop={8}
              onPress={() => setExpanded(e => (e === row.id ? null : row.id))}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? 'Collapse row' : 'Expand row'}
              className="h-7 w-7 items-center justify-center rounded-full border border-surface-border bg-white">
              <Text className="text-xs text-ink-muted">{isExpanded ? '▲' : '▼'}</Text>
            </Pressable>
          </View>
          {/* selection */}
          <View style={{ width: CHECK_W }} className="items-center justify-center">
            <Pressable
              hitSlop={8}
              onPress={() => toggleSelect(row.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              className={`h-5 w-5 items-center justify-center rounded border ${
                isSelected ? 'border-brand-600 bg-brand-600' : 'border-ink-faint bg-white'
              }`}>
              {isSelected ? (
                <Text className="text-[10px] font-bold text-white">✓</Text>
              ) : null}
            </Pressable>
          </View>
          {/* data cells */}
          {visibleColumns.map(col => (
            <View key={col.key} style={{ width: col.width }} className="justify-center px-3">
              <Cell col={col} value={row.cells[col.key]} />
            </View>
          ))}
          {/* actions */}
          <View
            style={{ width: ACTIONS_W }}
            className="flex-row items-center justify-around px-2">
            {ROW_ACTIONS.map(({ key, label, Icon, borderClass }) => (
              <Pressable
                key={key}
                hitSlop={6}
                onPress={() => onRowAction(label, row)}
                accessibilityRole="button"
                accessibilityLabel={label}
                className={`h-9 w-9 items-center justify-center rounded-lg border bg-white ${borderClass} active:opacity-60`}>
                <Icon size={20} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* expanded detail panel — spans the full table width */}
        {isExpanded ? (
          <View
            style={{ width: totalWidth }}
            className="items-center bg-surface-muted py-5">
            {row.additionalDetails.length === 0 ? (
              <Text className="text-sm font-medium text-info">
                ✉ No Additional Details Available
              </Text>
            ) : (
              <View className="w-full flex-row flex-wrap px-6">
                {row.additionalDetails.map(d => (
                  <View key={d.label} className="w-1/2 py-1.5 pr-2">
                    <Text className="text-[11px] font-semibold uppercase text-ink-faint">
                      {d.label}
                    </Text>
                    <Text className="mt-0.5 text-sm text-ink">{d.value || '—'}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-surface-muted">
      {/* Dynamic tabs (data-driven from approvalTabs.json) */}
      <View className="border-b border-surface-border bg-white pb-3 pt-2">
        {tabs.loading ? (
          <Text className="px-4 py-2 text-sm text-ink-muted">Loading tabs…</Text>
        ) : (
          <SegmentedTabs
            className="px-4"
            items={tabs.data ?? []}
            activeKey={activeKey}
            onChange={onChangeTab}
          />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: selectedCount > 0 ? 112 : insets.bottom + 24,
        }}>
        {/* Title + toolbar (Export · Toggle Columns) + search */}
        <View className="px-4 pt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="flex-1 text-lg font-bold text-ink" numberOfLines={1}>
              {tabTitle}
            </Text>
            <View className="ml-2 flex-row items-center gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Export"
                onPress={() => Alert.alert('Export', 'Export coming soon.')}
                className="h-10 flex-row items-center rounded-xl border border-surface-border bg-white px-3 active:bg-surface-muted">
                <Text className="text-ink-muted">↓</Text>
                <Text className="ml-1.5 text-sm font-semibold text-ink">Export</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle columns"
                onPress={() => setColumnsModal(true)}
                className="h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-white active:bg-surface-muted">
                <Text className="text-lg text-ink-muted">☰</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-3 h-12 flex-row items-center rounded-xl border border-surface-border bg-white px-3">
            <Text className="text-ink-faint">🔍</Text>
            <TextInput
              className="ml-2 flex-1 p-0 text-base text-ink"
              placeholder="Search by anything…"
              placeholderTextColor={colors.inkFaint}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 ? (
              <Pressable hitSlop={8} onPress={() => setQuery('')}>
                <Text className="text-ink-muted">✕</Text>
              </Pressable>
            ) : null}
          </View>

          <Text className="mb-2 text-sm text-ink-muted">
            {filtered.length} record(s)
            {hiddenCols.size > 0 ? ` · ${hiddenCols.size} column(s) hidden` : ''}
          </Text>
        </View>

        {/* The table itself — scrolls horizontally */}
        {loading ? (
          <LoadingView />
        ) : filtered.length === 0 ? (
          <EmptyView
            title="No Data Found"
            subtitle="There are no items awaiting approval in this category."
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            className="mx-4 rounded-2xl border border-surface-border bg-white">
            <View style={{ width: totalWidth }}>
              {HeaderRow}
              {filtered.map(renderRow)}
            </View>
          </ScrollView>
        )}
      </ScrollView>

      {/* Bulk action bar — appears once at least one row is selected */}
      {selectedCount > 0 ? (
        <View
          className="absolute inset-x-0 bottom-0 border-t border-surface-border bg-white px-4 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}>
          <Text className="mb-2 text-sm font-semibold text-ink">
            {selectedCount} selected
          </Text>
          <View className="flex-row gap-3">
            <Button
              label="Refer Back All Selected"
              variant="secondary"
              className="flex-1"
              onPress={() => onBulk('Refer Back All Selected')}
            />
            <Button
              label="Approve All Selected"
              className="flex-1"
              onPress={() => onBulk('Approve All Selected')}
            />
          </View>
        </View>
      ) : null}

      {/* Toggle Columns panel */}
      <Modal
        visible={columnsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setColumnsModal(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setColumnsModal(false)}>
          <Pressable className="max-h-[80%] w-full overflow-hidden rounded-2xl bg-white">
            <View className="flex-row items-center justify-between border-b border-surface-border px-5 py-4">
              <Text className="text-base font-bold text-ink">Toggle Columns</Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  setHiddenCols(
                    hiddenCols.size === table.columns.length
                      ? new Set()
                      : new Set(table.columns.map(c => c.key)),
                  )
                }>
                <Text className="text-sm font-semibold text-brand-600">
                  {hiddenCols.size === table.columns.length ? 'Show all' : 'Hide all'}
                </Text>
              </Pressable>
            </View>

            <ScrollView bounces={false} className="px-4 py-3">
              <View className="flex-row flex-wrap">
                {table.columns.map(col => {
                  const checked = !hiddenCols.has(col.key);
                  return (
                    <Pressable
                      key={col.key}
                      onPress={() => toggleColumn(col.key)}
                      className="w-1/2 flex-row items-center py-3 pr-3"
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}>
                      <View
                        className={`h-6 w-6 items-center justify-center rounded-md ${
                          checked ? 'bg-brand-600' : 'border border-ink-faint bg-white'
                        }`}>
                        {checked ? (
                          <Text className="text-xs font-bold text-white">✓</Text>
                        ) : null}
                      </View>
                      <Text
                        className="ml-3 flex-1 text-sm font-medium text-ink"
                        numberOfLines={1}>
                        {col.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View className="border-t border-surface-border px-5 py-3.5">
              <Pressable
                hitSlop={10}
                onPress={() => setColumnsModal(false)}
                className="self-end"
                accessibilityRole="button">
                <Text className="text-base font-semibold text-brand-600">Done</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
