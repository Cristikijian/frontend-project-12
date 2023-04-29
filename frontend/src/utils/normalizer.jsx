import { useDispatch } from 'react-redux';
import { normalize, schema } from 'normalizr';

const Normalizer = () => {
  const dispatch = useDispatch();

  const getNormalized = (data) => {
    const chat = new schema.Entity('chats');


    return normalize(data, [chat]);
  };
}

export default Normalizer;
