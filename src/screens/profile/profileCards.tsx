/**
 * Shared profile cards. References and addresses appear under both the
 * Overview tab and the General Info tab, so they live here to avoid drift.
 */
import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Badge, Button, Card, InfoRow } from '../../components';
import type { BadgeTone } from '../../components';
import type {
  AddressInfo,
  BankAccount,
  CareerStage,
  ContractInfo,
  Dependant,
  EarningChange,
  EmployeeDocument,
  IncrementRecord,
  LeaveTakenYear,
  PromotionRecord,
  Qualification,
  Reference,
  SalaryLine,
  TransferRecord,
  WorkExperience,
} from '../../types';
import { formatAmount } from '../../utils/format';

/** "View attachment" is a no-op in the static build. */
function viewAttachment() {
  Alert.alert('Attachment', 'Document preview is coming soon.');
}

/** Green ✓ / red ✕ disc mirroring the web's yes/no status icons. */
function BoolMark({ value }: { value: boolean }) {
  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-full ${
        value ? 'bg-success' : 'bg-danger'
      }`}>
      <Text className="text-xs font-bold text-white">{value ? '✓' : '✕'}</Text>
    </View>
  );
}

/** Label/value row whose value is a boolean rendered as a status disc. */
function BoolRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: boolean;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        last ? '' : 'border-b border-surface-border'
      }`}>
      <Text className="mr-4 flex-1 text-sm text-ink-muted">{label}</Text>
      <BoolMark value={value} />
    </View>
  );
}

export function ReferenceCard({
  reference,
  index,
}: {
  reference: Reference;
  index: number;
}) {
  return (
    <Card>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-ink">
          Reference {index}
        </Text>
        <Badge label={`Reference ${index}`} tone="info" />
      </View>
      <InfoRow label="Name" value={reference.name} />
      <InfoRow label="Designation" value={reference.designation} />
      <InfoRow label="Phone No" value={reference.phoneNo} />
      <InfoRow label="Email Id" value={reference.email} />
      <InfoRow label="Organisation" value={reference.organisation} />
      <InfoRow label="Address" value={reference.address} last />
    </Card>
  );
}

const addressTone: Record<string, BadgeTone> = {
  Permanent: 'success',
  Local: 'info',
  Temporary: 'warning',
  'Emergency 1': 'danger',
  'Emergency 2': 'danger',
};

export function AddressCard({ address }: { address: AddressInfo }) {
  return (
    <Card>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-ink">{address.kind}</Text>
        <Badge
          label={address.kind.toUpperCase()}
          tone={addressTone[address.kind] ?? 'neutral'}
        />
      </View>
      <InfoRow label="Contact Name" value={address.contactName} />
      <InfoRow label="City" value={address.city} />
      <InfoRow label="Country" value={address.country} />
      <InfoRow label="Address" value={address.address} />
      <InfoRow label="Region" value={address.region} />
      <InfoRow label="Address Type" value={address.addressType} />
      <InfoRow label="Address Nature" value={address.addressNature} last />
    </Card>
  );
}

export function WorkExperienceCard({ item }: { item: WorkExperience }) {
  return (
    <Card>
      <View className="mb-2 flex-row items-center">
        <Badge label={item.fromDate} tone="success" />
        <Text className="mx-2 text-ink-faint">→</Text>
        <Badge label={item.toDate} tone="neutral" />
      </View>
      <InfoRow label="Designation" value={item.designation} />
      <InfoRow label="Company with Location" value={item.company} />
      <InfoRow label="Experience" value={item.experience} last={!item.hasAttachment} />
      {item.hasAttachment ? (
        <Button
          label="View attachment"
          variant="secondary"
          onPress={viewAttachment}
          className="mt-3"
        />
      ) : null}
    </Card>
  );
}

export function QualificationCard({ item }: { item: Qualification }) {
  return (
    <Card>
      <View className="mb-2 flex-row items-center justify-between">
        <Badge label={item.year} tone="success" />
        {item.highestDegree ? <Badge label="Highest Degree" tone="info" /> : null}
      </View>
      <InfoRow label="Degree" value={item.degree} />
      <InfoRow label="Specialization" value={item.specialization} />
      <InfoRow label="University" value={item.university} />
      <InfoRow label="Location" value={item.location} />
      <InfoRow
        label="Highest Degree"
        value={item.highestDegree ? 'Yes' : 'No'}
        last={!item.hasAttachment}
      />
      {item.hasAttachment ? (
        <Button
          label="View attachment"
          variant="secondary"
          onPress={viewAttachment}
          className="mt-3"
        />
      ) : null}
    </Card>
  );
}

/* ── Contract tab ────────────────────────────────────────────────────────── */

export function ContractEmploymentCard({ contract }: { contract: ContractInfo }) {
  return (
    <Card>
      <InfoRow label="Category" value={contract.category} />
      <InfoRow label="Contract Type" value={contract.contractType} />
      <InfoRow label="Last Paid Date" value={contract.lastPaidDate} />
      <InfoRow label="Contract Period" value={contract.contractPeriod} />
      <InfoRow label="Working Pattern" value={contract.workingPattern} />
      <InfoRow label="Contract Expiry Date" value={contract.contractExpiryDate} />
      <BoolRow label="OT Eligible" value={contract.otEligible} />
      <InfoRow label="Notice Period (Days)" value={contract.noticePeriodDays} />
      <InfoRow label="Currency" value={contract.currency} />
      <InfoRow label="Salary" value={contract.salary} last />
    </Card>
  );
}

export function ContractBenefitsCard({ contract }: { contract: ContractInfo }) {
  return (
    <Card>
      <BoolRow label="Probation Applicable" value={contract.probationApplicable} />
      <BoolRow label="Passage Applicable" value={contract.passageApplicable} />
      <InfoRow label="Probation Period" value={contract.probationPeriod} />
      <InfoRow label="Passage Frequency" value={contract.passageFrequency} />
      <InfoRow label="Probation End Date" value={contract.probationEndDate} />
      <InfoRow label="Sector (Passage)" value={contract.sectorPassage} />
      <BoolRow label="Leave Eligible" value={contract.leaveEligible} />
      <InfoRow label="SSN No" value={contract.ssnNo} />
      <InfoRow label="SSN Deduction" value={contract.ssnDeduction} />
      <InfoRow label="Gratuity" value={contract.gratuity} last />
    </Card>
  );
}

/* ── Payment tab ─────────────────────────────────────────────────────────── */

export function BankAccountCard({
  title,
  account,
}: {
  title: string;
  account: BankAccount;
}) {
  return (
    <Card>
      <Text className="mb-2 text-base font-semibold text-ink">{title}</Text>
      <InfoRow label="Payee Name" value={account.payeeName} />
      <InfoRow label="Bank Name" value={account.bankName} />
      <InfoRow label="Branch Name" value={account.branchName} />
      <InfoRow label="Bank Account Number" value={account.accountNumber} last />
    </Card>
  );
}

/* ── Dependants tab ──────────────────────────────────────────────────────── */

const relationTone: Record<string, BadgeTone> = {
  Wife: 'info',
  Husband: 'info',
  Son: 'success',
  Daughter: 'warning',
};

export function DependantCard({ dependant }: { dependant: Dependant }) {
  return (
    <Card>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-ink">
          {dependant.name}
        </Text>
        <Badge
          label={dependant.relation.toUpperCase()}
          tone={relationTone[dependant.relation] ?? 'neutral'}
        />
      </View>
      <InfoRow label="DOB" value={dependant.dateOfBirth} />
      <InfoRow label="Age" value={dependant.age} />
      <InfoRow label="Gender" value={dependant.gender} />
      <InfoRow label="Blood Group" value={dependant.bloodGroup} />
      <BoolRow label="Visa" value={dependant.visa} />
      <BoolRow label="Tickets" value={dependant.tickets} />
      <InfoRow label="Passage" value={dependant.passage} />
      <InfoRow label="Passage Frequency" value={dependant.passageFrequency} />
      <InfoRow label="Nationality" value={dependant.nationality} />
      <InfoRow label="Occupation" value={dependant.occupation} last />
    </Card>
  );
}

/* ── Documents tab ───────────────────────────────────────────────────────── */

/** Left accent border per document type, mirroring the web's colored stripe. */
const docAccent: Record<string, string> = {
  Passport: 'border-l-violet-400',
  'Resident Card': 'border-l-blue-400',
  Visa: 'border-l-green-500',
};

export function DocumentCard({ document }: { document: EmployeeDocument }) {
  return (
    <Card className={`border-l-4 ${docAccent[document.type] ?? 'border-l-surface-border'}`}>
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-base font-bold uppercase text-ink">{document.type}</Text>
        {document.relation ? (
          <Badge
            label={document.relation.toUpperCase()}
            tone={relationTone[document.relation] ?? 'neutral'}
          />
        ) : null}
      </View>
      <Text className="text-sm font-medium text-ink-muted">{document.holderName}</Text>
      <InfoRow label="Issue Place" value={document.issuePlace} />
      <InfoRow label="Issue Date" value={document.issueDate} />
      <InfoRow label="Expiry Date" value={document.expiryDate} last />
      <Button
        label="View"
        variant="secondary"
        onPress={viewAttachment}
        className="mt-3"
      />
    </Card>
  );
}

/* ── Salary Details tab ──────────────────────────────────────────────────── */

export function SalaryLineCard({ line }: { line: SalaryLine }) {
  const isEarning = line.earnings > 0;
  const amount = isEarning ? line.earnings : line.deductions;
  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-ink">{line.name}</Text>
        <Text className={`text-base font-semibold ${isEarning ? 'text-success' : 'text-danger'}`}>
          {isEarning ? '' : '- '}
          {formatAmount(amount)}
        </Text>
      </View>
      <InfoRow label="Basis" value={line.basis} />
      <InfoRow label="Percentage" value={line.percentage} />
      <InfoRow label="Eff. Start Date" value={line.effStartDate} />
      <InfoRow label="Eff. End Date" value={line.effEndDate} last />
    </Card>
  );
}

/* ── Performance tab ─────────────────────────────────────────────────────── */

/** Green date chip shown on each performance timeline entry. */
function DateChip({ date }: { date: string }) {
  return (
    <View className="mb-2 self-start rounded-full bg-green-100 px-3 py-1">
      <Text className="text-xs font-bold text-success">{date}</Text>
    </View>
  );
}

/** Txn No / Txn Date / Notes footer shared by promotion & increment cards. */
function TxnFooter({
  txnNo,
  txnDate,
  notes,
}: {
  txnNo: string;
  txnDate: string;
  notes: string;
}) {
  return (
    <View className="mt-3 rounded-xl bg-surface-muted p-3">
      <Text className="text-xs text-ink-muted">Txn No: {txnNo}</Text>
      <Text className="mt-1 text-xs text-ink-muted">Txn Date: {txnDate}</Text>
      <Text className="mt-1 text-xs text-ink-muted">Notes: {notes}</Text>
    </View>
  );
}

/** One old→new earning line with a colored increment delta. */
function EarningChangeRow({ line, last }: { line: EarningChange; last?: boolean }) {
  const positive = line.increment > 0;
  const negative = line.increment < 0;
  const deltaClass = positive ? 'text-success' : negative ? 'text-danger' : 'text-ink-muted';
  return (
    <View className={`py-3 ${last ? '' : 'border-b border-surface-border'}`}>
      <Text className="text-sm font-semibold text-ink">{line.description}</Text>
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-sm text-ink-muted">
          {formatAmount(line.oldAmount)} → {formatAmount(line.newAmount)}
        </Text>
        <Text className={`text-sm font-semibold ${deltaClass}`}>
          {positive ? '▲ ' : ''}
          {formatAmount(line.increment)}
        </Text>
      </View>
    </View>
  );
}

export function TransferCard({ record }: { record: TransferRecord }) {
  return (
    <View>
      <DateChip date={record.date} />
      <Card>
        {record.changes.map((change, i) => (
          <View
            key={change.attribute}
            className={`py-3 ${
              i === record.changes.length - 1 ? '' : 'border-b border-surface-border'
            }`}>
            <Text className="text-sm font-semibold text-ink">{change.attribute}</Text>
            <Text className="mt-1 text-sm text-ink-muted">{change.oldValue}</Text>
            <Text className="mt-0.5 text-sm font-medium text-ink">→ {change.newValue}</Text>
          </View>
        ))}
        <TxnFooter txnNo={record.txnNo} txnDate={record.txnDate} notes={record.notes} />
      </Card>
    </View>
  );
}

export function PromotionCard({ record }: { record: PromotionRecord }) {
  return (
    <View>
      <DateChip date={record.date} />
      <Card>
        <View className="mb-2 flex-row items-center justify-center">
          <View className="items-center">
            <Text className="text-sm font-bold text-ink">{record.fromRole}</Text>
            <Text className="text-xs text-ink-muted">{record.fromGrade}</Text>
          </View>
          <Text className="mx-3 text-ink-faint">→</Text>
          <View className="items-center">
            <Text className="text-sm font-bold text-ink">{record.toRole}</Text>
            <Text className="text-xs text-ink-muted">{record.toGrade}</Text>
          </View>
        </View>
        {record.lines.map((line, i) => (
          <EarningChangeRow key={line.description} line={line} last={i === record.lines.length - 1} />
        ))}
        <View className="mt-1 flex-row items-center justify-between border-t border-surface-border pt-3">
          <Text className="text-sm font-bold text-ink">Total Increase</Text>
          <Text className="text-sm font-bold text-ink">{formatAmount(record.totalIncrease)}</Text>
        </View>
        <TxnFooter txnNo={record.txnNo} txnDate={record.txnDate} notes={record.notes} />
      </Card>
    </View>
  );
}

export function IncrementCard({ record }: { record: IncrementRecord }) {
  return (
    <View>
      <DateChip date={record.date} />
      <Card>
        {record.lines.map((line, i) => (
          <EarningChangeRow key={line.description} line={line} last={i === record.lines.length - 1} />
        ))}
        <View className="mt-1 flex-row items-center justify-between border-t border-surface-border pt-3">
          <Text className="text-sm font-bold text-ink">Total Increase</Text>
          <Text className="text-sm font-bold text-ink">{formatAmount(record.totalIncrease)}</Text>
        </View>
        <TxnFooter txnNo={record.txnNo} txnDate={record.txnDate} notes={record.notes} />
      </Card>
    </View>
  );
}

/* ── Leaves Taken tab ────────────────────────────────────────────────────── */

const barTone: Record<LeaveTakenYear['tone'], string> = {
  normal: 'bg-brand-600',
  high: 'bg-danger',
  low: 'bg-success',
};

const CHART_HEIGHT = 150;

export function LeavesTakenChart({ data }: { data: LeaveTakenYear[] }) {
  const max = Math.max(...data.map(d => d.days), 1);
  return (
    <Card>
      <Text className="mb-4 text-sm font-semibold text-ink-muted">Leave Taken Details</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-end gap-3" style={{ height: CHART_HEIGHT + 32 }}>
          {data.map(d => (
            <View key={d.year} className="items-center justify-end">
              <Text className="mb-1 text-xs font-semibold text-ink">{d.days}</Text>
              <View
                className={`w-7 rounded-t-md ${barTone[d.tone]}`}
                style={{ height: Math.max((d.days / max) * CHART_HEIGHT, 4) }}
              />
              <Text className="mt-1 text-xs text-ink-muted">{d.year}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
}

/* ── Career Plan tab ─────────────────────────────────────────────────────── */

/** Solid header color + icon per stage, approximating the web's gradient nodes. */
const stageStyles = [
  { bg: 'bg-cyan-500', icon: '🎓' },
  { bg: 'bg-pink-500', icon: '🎯' },
  { bg: 'bg-blue-500', icon: '🧑‍💼' },
  { bg: 'bg-purple-500', icon: '🏅' },
  { bg: 'bg-indigo-500', icon: '📈' },
  { bg: 'bg-violet-600', icon: '🧭' },
  { bg: 'bg-fuchsia-600', icon: '🤝' },
];

/**
 * Horizontal, connected progression of role nodes — the mobile analog of the
 * web Career Path graph. Scrolls sideways; the current role is ringed and tagged.
 */
export function CareerPathChart({ stages }: { stages: CareerStage[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="items-center pr-4">
      {stages.map((stage, i) => {
        const style = stageStyles[i % stageStyles.length];
        const ring = stage.current ? 'border-2 border-brand-700' : '';
        return (
          <View key={stage.id} className="flex-row items-center">
            <View className="w-64">
              <View className="h-6 items-center justify-center">
                {stage.current ? (
                  <View className="rounded-full bg-brand-600 px-2.5 py-0.5">
                    <Text className="text-[10px] font-bold text-white">● YOU ARE HERE</Text>
                  </View>
                ) : null}
              </View>

              <View className={`rounded-t-2xl ${style.bg} p-4 ${ring} border-b-0`}>
                <View className="mb-1 flex-row items-center">
                  <Text className="mr-2 text-lg">{style.icon}</Text>
                  <Text className="flex-1 text-base font-bold text-white">{stage.title}</Text>
                </View>
                <Text className="text-xs text-white">{stage.description}</Text>
                <View className="mt-3 flex-row items-center justify-between rounded-lg bg-white px-3 py-1.5">
                  <Text className="text-[11px] text-ink-muted">Next level in</Text>
                  <Text className="text-[11px] font-bold text-ink">{stage.nextLevelIn}</Text>
                </View>
              </View>

              <View
                className={`rounded-b-2xl border border-t-0 border-surface-border bg-white p-4 ${ring}`}>
                <Text className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Responsibilities
                </Text>
                {stage.responsibilities.map(item => (
                  <View key={item} className="flex-row items-start py-0.5">
                    <Text className="mr-2 text-brand-600">•</Text>
                    <Text className="flex-1 text-xs text-ink">{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {i < stages.length - 1 ? (
              <Text className="px-2 text-2xl text-ink-faint">→</Text>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
