import React from 'react';
import { Text, View } from 'react-native';
import {
  Avatar,
  Card,
  InfoRow,
  LoadingView,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import { profileService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';

export function PersonalDetailsScreen() {
  const { data, loading } = useAsync(profileService.getPersonalDetails);

  if (loading || !data) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingView />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card className="mb-5 items-center py-6">
        <Avatar name={data.fullName} size={72} />
        <Text className="mt-3 text-lg font-bold text-ink">{data.fullName}</Text>
        <Text className="text-sm text-ink-muted">{data.employeeId}</Text>
      </Card>

      <SectionHeader title="Basic Information" />
      <Card className="mb-5">
        <InfoRow label="Date of Birth" value={data.dateOfBirth} />
        <InfoRow label="Gender" value={data.gender} />
        <InfoRow label="Blood Group" value={data.bloodGroup} />
        <InfoRow label="Marital Status" value={data.maritalStatus} last />
      </Card>

      <SectionHeader title="Contact" />
      <Card className="mb-5">
        <InfoRow label="Phone" value={data.phone} />
        <InfoRow label="Personal Email" value={data.personalEmail} />
        <InfoRow label="Address" value={data.address} last />
      </Card>

      <SectionHeader title="Emergency Contact" />
      <Card>
        <InfoRow label="Name" value={data.emergencyContactName} />
        <InfoRow label="Phone" value={data.emergencyContactPhone} last />
      </Card>
    </ScreenContainer>
  );
}
