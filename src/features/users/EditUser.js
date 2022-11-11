import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserById } from './usersApiSlice';
import EditUserForm from './EditUserForm';


const EditUser = () => {
    const { id } = useParams();
    const user = useSelector(state => getUserById(state, id));

    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>
  return content
}

export default EditUser