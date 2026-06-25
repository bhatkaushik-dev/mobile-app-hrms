import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Avatar,
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
import type {
  EmployeeProfile,
  GeneralInfo,
  OrganizationInfo,
  ProfileOverview,
} from '../../types';
import {
  AddressCard,
  QualificationCard,
  ReferenceCard,
  WorkExperienceCard,
} from './profileCards';

type TabKey = 'organization' | 'overview' | 'general';

const TABS: SegmentedTabItem[] = [
  { key: 'organization', label: 'Organization' },
  { key: 'overview', label: 'Overview' },
  { key: 'general', label: 'General Info' },
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
