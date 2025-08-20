import React, { useEffect } from 'react';
import Modal from '../../../../elements/Modal';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { Input } from '../../../../elements/Input';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Connect,
  Target,
  Title,
} from '../../../../../../public/icons/Svg';
import Swal from 'sweetalert2';
import axios from 'axios';
import { channelsThunk } from '../../../../../store/slices/channel.slice';
import appError from '../../../../../utils/appError';
import apiConfig from '../../../../../utils/apiConfig';
import { setLoad } from '../../../../../store/slices/loader.slice';

export const UpdateChannel = ({
  modal,
  setModal,
  channel,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const url = `${
      apiConfig().endpoint
    }/channels/${channel.id}`;

    dispatch(setLoad(false));

    await axios
      .patch(url, data, apiConfig().axios)
      .then((res) => {
        reset();
        setModal(false);
        dispatch(channelsThunk());
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'success',
          text: res.data.message,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        appError(err);
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'error',
          text: err.response.data.message,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      })
      .finally(() => {
        dispatch(setLoad(true));
      });
  };

  useEffect(() => {
    setValue('port', channel?.port);
    setValue('name', channel?.name);
  }, [channel]);

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Update channel'}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(submit)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Input
            icon={<Connect />}
            id="port"
            name="port"
            type="number"
            label="Port"
            min="1"
            placeholder={channel?.port}
            defaultValue={channel?.port}
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required:
                    'Please provide a valid port',
                },
              },
            }}
          />
          <Input
            icon={<Title />}
            id="name"
            name="name"
            type="text"
            label="Name"
            min="1"
            placeholder={channel?.name}
            defaultValue={channel?.name}
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required:
                    'Please provide a name',
                },
              },
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SecondaryButton
            type="button"
            onClick={() => setModal(false)}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">
            Accept
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
