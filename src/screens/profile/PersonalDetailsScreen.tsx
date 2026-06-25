import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Avatar,
  Badge,
  Card,
  EmptyView,
  InfoRow,
  LoadingView,
  ScreenContainer,
  SectionHeader,
  SegmentedTabs,
} from '../../components';
import type { SegmentedTabItem } from '../../components';
import { profileService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { formatAmount } from '../../utils/format';
import type {
  CareerPlan,
  ContractInfo,
  Dependant,
  DocumentsInfo,
  EmployeeProfile,
  GeneralInfo,
  LeaveTakenYear,
  OrganizationInfo,
  PaymentInfo,
  PerformanceInfo,
  ProfileOverview,
  SalaryDetails,
} from '../../types';
import {
  AddressCard,
  BankAccountCard,
  CareerPathChart,
  ContractBenefitsCard,
  ContractEmploymentCard,
  DependantCard,
  DocumentCard,
  IncrementCard,
  LeavesTakenChart,
  PromotionCard,
  QualificationCard,
  ReferenceCard,
  SalaryLineCard,
  TransferCard,
  WorkExperienceCard,
} from './profileCards';

type TabKey =
  | 'organization'
  | 'overview'
  | 'general'
  | 'contract'
  | 'payment'
  | 'dependants'
  | 'documents'
  | 'salary'
  | 'performance'
  | 'leaves'
  | 'loans'
  | 'career';

const TABS: SegmentedTabItem[] = [
  { key: 'organization', label: 'Organization' },
  { key: 'overview', label: 'Overview' },
  { key: 'general', label: 'General Info' },
  { key: 'contract', label: 'Contract' },
  { key: 'payment', label: 'Payment' },
  { key: 'dependants', label: 'Dependants' },
  { key: 'documents', label: 'Documents' },
  { key: 'salary', label: 'Salary Details' },
  { key: 'performance', label: 'Performance' },
  { key: 'leaves', label: 'Leaves Taken' },
  { key: 'loans', label: 'Active Loans' },
  { key: 'career', label: 'Career Plan' },
];

export function PersonalDetailsScreen() {
  const { data, loading } = useAsync(profileService.getEmployeeProfile);
  const [tab, setTab] = useState<TabKey>('organization');

  if (loading || !data) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingView />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ProfileHeaderCard profile={data} />

      <SegmentedTabs
        items={TABS}
        activeKey={tab}
        onChange={key => setTab(key as TabKey)}
        className="mb-5"
      />

      {tab === 'organization' && <OrganizationTab org={data.organization} />}
      {tab === 'overview' && <OverviewTab overview={data.overview} />}
      {tab === 'general' && <GeneralInfoTab profile={data} />}
      {tab === 'contract' && <ContractTab contract={data.contract} />}
      {tab === 'payment' && <PaymentTab payment={data.payment} />}
      {tab === 'dependants' && <DependantsTab dependants={data.dependants} />}
      {tab === 'documents' && <DocumentsTab documents={data.documents} />}
      {tab === 'salary' && <SalaryTab salary={data.salary} />}
      {tab === 'performance' && <PerformanceTab performance={data.performance} />}
      {tab === 'leaves' && <LeavesTakenTab leaves={data.leavesTaken} />}
      {tab === 'loans' && <ActiveLoansTab count={data.activeLoans.length} />}
      {tab === 'career' && <CareerPlanTab plan={data.careerPlan} />}
    </ScreenContainer>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */

function ProfileHeaderCard({ profile }: { profile: EmployeeProfile }) {
  const { header } = profile;
  return (
    <Card className="mb-5 items-center py-6">
      <Avatar name={header.fullName} size={72} />
      <Text className="mt-3 text-lg font-bold text-ink">{header.fullName}</Text>
      <Text className="text-sm font-medium text-brand-600">
        {header.designation}
      </Text>
      <View className="mt-3 w-full">
        <InfoRow label="Phone" value={header.phone} />
        <InfoRow label="Email" value={header.email} />
        <InfoRow label="Location" value={header.location} last />
      </View>
    </Card>
  );
}

/* ── Organization tab ────────────────────────────────────────────────────── */

function OrganizationTab({ org }: { org: OrganizationInfo }) {
  return (
    <>
      <SectionHeader title="Organization Structure" />
      <Card className="mb-5">
        <InfoRow label="Division" value={org.division} />
        <InfoRow label="Branch" value={org.branch} />
        <InfoRow label="Department" value={org.department} />
        <InfoRow label="Section" value={org.section} last />
      </Card>

      <SectionHeader title="Employee Details" />
      <Card>
        <InfoRow label="Job Type" value={org.jobType} />
        <InfoRow label="Designation" value={org.designation} />
        <InfoRow label="Grade" value={org.grade} />
        <InfoRow label="Location" value={org.location} />
        <InfoRow label="Joined Date" value={org.joinedDate} />
        <InfoRow label="Service Period" value={org.servicePeriod} />
        <InfoRow label="Expatriate" value={org.expatriate ? 'Yes' : 'No'} />
        <InfoRow label="Reports To" value={org.reportsTo} />
        <InfoRow label="Role" value={org.role} last />
      </Card>
    </>
  );
}

/* ── Overview tab ────────────────────────────────────────────────────────── */

function OverviewTab({ overview }: { overview: ProfileOverview }) {
  return (
    <>
      <SectionHeader title="Reference Details" />
      <View className="mb-5 gap-3">
        {overview.references.map((ref, i) => (
          <ReferenceCard key={ref.id} reference={ref} index={i + 1} />
        ))}
      </View>

      <SectionHeader title="Address Information" />
      <View className="gap-3">
        {overview.addresses.map(address => (
          <AddressCard key={address.kind} address={address} />
        ))}
      </View>
    </>
  );
}

/* ── General Info tab (nested sub-tabs) ──────────────────────────────────── */

type GeneralTabKey = 'reference' | 'address' | 'work' | 'qualification';

const GENERAL_TABS: SegmentedTabItem[] = [
  { key: 'reference', label: 'Reference Details' },
  { key: 'address', label: 'Address Details' },
  { key: 'work', label: 'Work Details' },
  { key: 'qualification', label: 'Qualification Details' },
];

function GeneralInfoTab({ profile }: { profile: EmployeeProfile }) {
  const [sub, setSub] = useState<GeneralTabKey>('reference');
  const { overview, generalInfo } = profile;

  return (
    <>
      <SegmentedTabs
        items={GENERAL_TABS}
        activeKey={sub}
        onChange={key => setSub(key as GeneralTabKey)}
        className="mb-5"
      />

      {sub === 'reference' && (
        <View className="gap-3">
          {overview.references.map((ref, i) => (
            <ReferenceCard key={ref.id} reference={ref} index={i + 1} />
          ))}
        </View>
      )}

      {sub === 'address' && (
        <View className="gap-3">
          {overview.addresses.map(address => (
            <AddressCard key={address.kind} address={address} />
          ))}
        </View>
      )}

      {sub === 'work' && <WorkDetails general={generalInfo} />}
      {sub === 'qualification' && <QualificationDetails general={generalInfo} />}
    </>
  );
}

function WorkDetails({ general }: { general: GeneralInfo }) {
  if (general.workExperience.length === 0) {
    return <EmptyView title="No work experience" subtitle="Nothing on record yet." />;
  }
  return (
    <View className="gap-3">
      {general.workExperience.map(item => (
        <WorkExperienceCard key={item.id} item={item} />
      ))}
    </View>
  );
}

function QualificationDetails({ general }: { general: GeneralInfo }) {
  if (general.qualifications.length === 0) {
    return <EmptyView title="No qualifications" subtitle="Nothing on record yet." />;
  }
  return (
    <View className="gap-3">
      {general.qualifications.map(item => (
        <QualificationCard key={item.id} item={item} />
      ))}
    </View>
  );
}

/* ── Contract tab ────────────────────────────────────────────────────────── */

function ContractTab({ contract }: { contract: ContractInfo }) {
  return (
    <>
      <SectionHeader title="Employment Details" />
      <View className="mb-5">
        <ContractEmploymentCard contract={contract} />
      </View>

      <SectionHeader title="Probation & Benefits" />
      <ContractBenefitsCard contract={contract} />
    </>
  );
}

/* ── Payment tab ─────────────────────────────────────────────────────────── */

function PaymentTab({ payment }: { payment: PaymentInfo }) {
  return (
    <>
      <SectionHeader title="Payment Info" />
      <Card className="mb-5">
        <InfoRow label="Payment Method" value={payment.paymentMethod} />
        <InfoRow label="Payment Type" value={payment.paymentType} last />
      </Card>

      <View className="gap-3">
        <BankAccountCard title="Primary Account Details" account={payment.primaryAccount} />
        {payment.secondaryAccount ? (
          <BankAccountCard
            title="Secondary Account Details"
            account={payment.secondaryAccount}
          />
        ) : null}
      </View>
    </>
  );
}

/* ── Dependants tab ──────────────────────────────────────────────────────── */

function DependantsTab({ dependants }: { dependants: Dependant[] }) {
  if (dependants.length === 0) {
    return <EmptyView title="No dependants" subtitle="Nothing on record yet." />;
  }
  return (
    <View className="gap-3">
      {dependants.map(dependant => (
        <DependantCard key={dependant.id} dependant={dependant} />
      ))}
    </View>
  );
}

/* ── Documents tab (My / Dependent sub-tabs) ─────────────────────────────── */

const DOCUMENT_TABS: SegmentedTabItem[] = [
  { key: 'my', label: 'My Documents' },
  { key: 'dependent', label: 'Dependent Documents' },
];

function DocumentsTab({ documents }: { documents: DocumentsInfo }) {
  const [sub, setSub] = useState<'my' | 'dependent'>('my');
  const list = sub === 'my' ? documents.myDocuments : documents.dependentDocuments;

  return (
    <>
      <SegmentedTabs
        items={DOCUMENT_TABS}
        activeKey={sub}
        onChange={key => setSub(key as 'my' | 'dependent')}
        className="mb-5"
      />
      {list.length === 0 ? (
        <EmptyView icon="📄" title="No documents found" />
      ) : (
        <View className="gap-3">
          {list.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </View>
      )}
    </>
  );
}

/* ── Salary Details tab (Summary / Details sub-tabs) ─────────────────────── */

const SALARY_TABS: SegmentedTabItem[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'details', label: 'Details' },
];

function SalaryTab({ salary }: { salary: SalaryDetails }) {
  const [sub, setSub] = useState<'summary' | 'details'>('summary');
  const lines = sub === 'summary' ? salary.summary : salary.details;

  return (
    <>
      <SegmentedTabs
        items={SALARY_TABS}
        activeKey={sub}
        onChange={key => setSub(key as 'summary' | 'details')}
        className="mb-5"
      />
      {lines.length === 0 ? (
        <EmptyView icon="💰" title="No salary records" subtitle="Nothing on record yet." />
      ) : (
        <>
          <View className="mb-5 gap-3">
            {lines.map(line => (
              <SalaryLineCard key={line.id} line={line} />
            ))}
          </View>
          <Card>
            <InfoRow label="Net Pay" value={formatAmount(salary.netPay)} last />
          </Card>
        </>
      )}
    </>
  );
}

/* ── Performance tab (four timelines) ────────────────────────────────────── */

const PERFORMANCE_TABS: SegmentedTabItem[] = [
  { key: 'transfers', label: 'Transfers' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'increments', label: 'Increments' },
  { key: 'disciplinary', label: 'Disciplinary Actions' },
];

type PerformanceTabKey = 'transfers' | 'promotions' | 'increments' | 'disciplinary';

function PerformanceTab({ performance }: { performance: PerformanceInfo }) {
  const [sub, setSub] = useState<PerformanceTabKey>('transfers');

  return (
    <>
      <SegmentedTabs
        items={PERFORMANCE_TABS}
        activeKey={sub}
        onChange={key => setSub(key as PerformanceTabKey)}
        className="mb-5"
      />

      {sub === 'transfers' &&
        (performance.transfers.length === 0 ? (
          <EmptyView title="No transfers" subtitle="Nothing on record yet." />
        ) : (
          <View className="gap-3">
            {performance.transfers.map(record => (
              <TransferCard key={record.id} record={record} />
            ))}
          </View>
        ))}

      {sub === 'promotions' &&
        (performance.promotions.length === 0 ? (
          <EmptyView title="No promotions" subtitle="Nothing on record yet." />
        ) : (
          <View className="gap-3">
            {performance.promotions.map(record => (
              <PromotionCard key={record.id} record={record} />
            ))}
          </View>
        ))}

      {sub === 'increments' &&
        (performance.increments.length === 0 ? (
          <EmptyView title="No increments" subtitle="Nothing on record yet." />
        ) : (
          <View className="gap-3">
            {performance.increments.map(record => (
              <IncrementCard key={record.id} record={record} />
            ))}
          </View>
        ))}

      {sub === 'disciplinary' && (
        <EmptyView title="No disciplinary actions" subtitle="Nothing on record yet." />
      )}
    </>
  );
}

/* ── Leaves Taken tab ────────────────────────────────────────────────────── */

function LeavesTakenTab({ leaves }: { leaves: LeaveTakenYear[] }) {
  if (leaves.length === 0) {
    return <EmptyView title="No leave records" subtitle="Nothing on record yet." />;
  }
  return <LeavesTakenChart data={leaves} />;
}

/* ── Active Loans tab ────────────────────────────────────────────────────── */

function ActiveLoansTab({ count }: { count: number }) {
  if (count === 0) {
    return <EmptyView icon="💳" title="No active loans found" />;
  }
  return null;
}

/* ── Career Plan tab ─────────────────────────────────────────────────────── */

function CareerPlanTab({ plan }: { plan: CareerPlan }) {
  return (
    <>
      <SectionHeader
        title="Career Path"
        action={<Badge label={`Current: ${plan.currentRole}`} tone="info" />}
      />
      <Text className="mb-3 text-xs text-ink-muted">
        Swipe sideways to view the full progression →
      </Text>
      <CareerPathChart stages={plan.stages} />
    </>
  );
}
