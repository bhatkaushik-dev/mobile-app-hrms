/**
 * Shared profile cards. References and addresses appear under both the
 * Overview tab and the General Info tab, so they live here to avoid drift.
 */
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { Badge, Button, Card, InfoRow } from '../../components';
import type { BadgeTone } from '../../components';
import type {
  AddressInfo,
  Qualification,
  Reference,
  WorkExperience,
} from '../../types';

/** "View attachment" is a no-op in the static build. */
function viewAttachment() {
  Alert.alert('Attachment', 'Document preview is coming soon.');
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
