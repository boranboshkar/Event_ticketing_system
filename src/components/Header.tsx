import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UnauthenticatedHeader from './UnauthenticatedHeader';
import UserHeader from './UserHeader';
import BackofficeHeader from './BackofficeHeader';

const Header = () => {
  const { isAuthenticated, userDetails } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <UnauthenticatedHeader />;
  }
  switch (userDetails?.permission) {
    case 'U':
      return <UserHeader />;
    case 'A':
    case 'W':
      return <BackofficeHeader />;
    default:
      return null;
  }
};

export default Header;
