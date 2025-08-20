import React from 'react';
import Modal from '../../../../elements/Modal';
import { Input } from '../../../../elements/Input';
import {
  Connect,
  Title,
} from '../../../../../../public/icons/Svg';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import apiConfig from '../../../../../utils/apiConfig';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { channelsThunk } from '../../../../../store/slices/channel.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';

export const CreateChannel = ({
  modal,
  setModal,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const url = `${
      apiConfig().endpoint
    }/channels`;

    dispatch(setLoad(false));

    await axios
      .post(url, data, apiConfig().axios)
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

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Create channel'}
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
            placeholder="Insert port"
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
            placeholder="Insert name"
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
