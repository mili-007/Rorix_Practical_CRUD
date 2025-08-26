import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required')
});

const LoginForm = ({
  users,
  onLogin,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isCreating) {
        const newUser = {
          name: data.email.split('@')[0],
          email: data.email,
          password: data.password,
        };
        onCreateUser(newUser);
        setIsCreating(false);
        reset();
      } else if (editingUser) {
        onUpdateUser(editingUser.id, {
          email: data.email,
          password: data.password,
        });
        setEditingUser(null);
        reset();
      } else {
        const user = users.find(u => u.email === data.email && u.password === data.password);
        if (user) {
          onLogin(user);
          reset();
        } else {
          Swal.fire({
            icon : "error",
            text :"Invalid email or password"
          })
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingUser(null);
    reset();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsCreating(false);
    setValue('email', user.email);
    setValue('password', user.password);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingUser(null);
    reset();
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isCreating ? 'Create User' : editingUser ? 'Edit User' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? 'Processing...' : 
               isCreating ? 'Create User' : 
               editingUser ? 'Update User' : 'Login'}
            </button>
            
            {(isCreating || editingUser) && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {!isCreating && !editingUser && (
          <div className="additional-actions">
            <button 
              onClick={handleCreateNew}
              className="create-btn"
            >
              Create New Account
            </button>
            <button 
              onClick={() => setShowUsers(!showUsers)}
              className="view-users-btn"
            >
              {showUsers ? 'Hide Users' : 'View Users'} ({users.length})
            </button>
          </div>
        )}

        {showUsers && users.length > 0 && (
          <div className="users-list">
            <h3>Registered Users</h3>
            {users.map(user => (
              <div key={user.id} className="user-item">
                <span>{user.email}</span>
                <div className="user-actions">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDeleteUser(user.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;