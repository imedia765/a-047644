import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import '@testing-library/jest-dom';

jest.mock('../login/useLoginForm', () => ({
  useLoginForm: () => ({
    memberNumber: '',
    setMemberNumber: jest.fn(),
    loading: false,
    handleLogin: jest.fn()
  })
}));

describe('LoginForm Component', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/member number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates member number input', () => {
    render(<LoginForm />);
    const input = screen.getByLabelText(/member number/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345' } });
    expect(input).toHaveValue('12345');
  });

  it('submits the form', () => {
    const mockHandleLogin = jest.fn();
    jest.mock('./login/useLoginForm', () => ({
      useLoginForm: () => ({
        memberNumber: '',
        setMemberNumber: jest.fn(),
        loading: false,
        handleLogin: mockHandleLogin
      })
    }));

    render(<LoginForm />);
    fireEvent.submit(screen.getByRole('form'));
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});