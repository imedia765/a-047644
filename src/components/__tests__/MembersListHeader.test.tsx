import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MembersListHeader from '../MembersListHeader';
import { renderWithProviders } from '@/test/setupTests';
import { Member } from '@/types/member';

describe('MembersListHeader Component', () => {
  const mockMembers: Member[] = [
    {
      id: '1',
      member_number: 'TEST001',
      full_name: 'Test User',
      address: null,
      admin_note: null,
      auth_user_id: null,
      collector: null,
      collector_id: null,
      cors_enabled: null,
      created_at: '2024-01-01',
      created_by: null,
      date_of_birth: null,
      email: null,
      emergency_collection_amount: null,
      emergency_collection_created_at: null,
      emergency_collection_due_date: null,
      emergency_collection_status: null,
      family_member_dob: null,
      family_member_gender: null,
      family_member_name: null,
      family_member_relationship: null,
      gender: null,
      marital_status: null,
      membership_type: null,
      payment_amount: null,
      payment_date: null,
      payment_notes: null,
      payment_type: null,
      phone: null,
      postcode: null,
      status: null,
      ticket_description: null,
      ticket_priority: null,
      ticket_status: null,
      ticket_subject: null,
      town: null,
      updated_at: '2024-01-01',
      verified: null,
      yearly_payment_amount: null,
      yearly_payment_due_date: null,
      yearly_payment_status: null
    },
    {
      id: '2',
      member_number: 'TEST002',
      full_name: 'Another User',
      address: null,
      admin_note: null,
      auth_user_id: null,
      collector: null,
      collector_id: null,
      cors_enabled: null,
      created_at: '2024-01-01',
      created_by: null,
      date_of_birth: null,
      email: null,
      emergency_collection_amount: null,
      emergency_collection_created_at: null,
      emergency_collection_due_date: null,
      emergency_collection_status: null,
      family_member_dob: null,
      family_member_gender: null,
      family_member_name: null,
      family_member_relationship: null,
      gender: null,
      marital_status: null,
      membership_type: null,
      payment_amount: null,
      payment_date: null,
      payment_notes: null,
      payment_type: null,
      phone: null,
      postcode: null,
      status: null,
      ticket_description: null,
      ticket_priority: null,
      ticket_status: null,
      ticket_subject: null,
      town: null,
      updated_at: '2024-01-01',
      verified: null,
      yearly_payment_amount: null,
      yearly_payment_due_date: null,
      yearly_payment_status: null
    },
  ];

  const defaultProps = {
    userRole: 'admin',
    hasMembers: true,
    collectorInfo: {},
    selectedMember: undefined,
    onProfileUpdated: vi.fn(),
    onPrint: vi.fn(),
    members: mockMembers,
  };

  it('renders header with title', () => {
    renderWithProviders(<MembersListHeader {...defaultProps} />);
    expect(screen.getByText('Members')).toBeInTheDocument();
  });

  it('shows export button for admin users', () => {
    renderWithProviders(<MembersListHeader {...defaultProps} />);
    expect(screen.getByText('Export Members')).toBeInTheDocument();
  });

  it('hides export button for non-admin users', () => {
    renderWithProviders(
      <MembersListHeader {...defaultProps} userRole="member" />
    );
    expect(screen.queryByText('Export Members')).not.toBeInTheDocument();
  });

  it('displays correct member count', () => {
    renderWithProviders(<MembersListHeader {...defaultProps} />);
    expect(screen.getByText('Showing 2 members')).toBeInTheDocument();
  });

  it('handles singular member count', () => {
    renderWithProviders(
      <MembersListHeader 
        {...defaultProps} 
        members={[mockMembers[0]]}
      />
    );
    expect(screen.getByText('Showing 1 member')).toBeInTheDocument();
  });

  it('handles empty members list', () => {
    renderWithProviders(
      <MembersListHeader 
        {...defaultProps} 
        members={[]}
        hasMembers={false}
      />
    );
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });
});