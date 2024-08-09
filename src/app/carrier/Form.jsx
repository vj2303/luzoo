"use client"

import React, { useState } from 'react'
import Checkbox from '@/components/Checkbox'
import Radio from '@/components/Radio'
import axios from 'axios'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'

const Form = () => {
    const { register, watch, handleSubmit, reset, formState: { errors, isSubmitting }, control } = useForm()
    const positionValue = watch('your_position'); // Watch the value of 'your_position'
  
    const Submit = async (data) => {
      try {
        const res = await axios({
          method: "post",
          url: `${process.env.NEXT_PUBLIC_HOST}/api/v1/lead/create`,
          data: { ...data, created_by: "web", type_of_entity: "test", other_notes: "be polite" },
        })
        reset()
        Swal.fire({
          title: 'Thank you for submitting. Our team will get in touch with you shortly. In the meantime, you can call or WhatsApp 8879949404',
          icon: 'success',
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: true,
        });
      } catch (error) {
        console.log(error);
        alert("Could not add lead")
      }
    };
  
    const formFields = [
      { name: 'salon_contacts.contact_name', label: 'Your Name*', type: 'text', validtion: { required: "Your name is required" } },
      { name: 'salon_contacts.contact_number', label: 'Your Contact*', type: 'number', validtion: { required: { value: true, message: "Your contact number is required" }, minLength: { value: 10, message: "Contact number must contain at least 10 digits" }, maxLength: { value: 10, message: "Contact number can max contain 10 digits" } } },
      { name: 'contacted_city', label: 'City*', type: 'text', validtion: { required: "City is required" } },
      {
        name: 'your_position',
        label: 'Your Position',
        type: 'radio',
        options: ['Manager', 'Stylist/Therapist'],
        validtion: { required: "This field is required" }
      },
      { name: 'current_salary', label: 'Current Salary*', type: 'text', validtion: { required: "Current salary is required" } },
      { name: 'expected_salary', label: 'Expected Salary*', type: 'text', validtion: { required: "Expected Salary is required" } },
    ];
  
    const therapistSpecialties = [
      { name: 'therapist_specialties.hair', label: 'Hair' },
      { name: 'therapist_specialties.beauty', label: 'Beauty' },
      { name: 'therapist_specialties.spa', label: 'Spa' },
      { name: 'therapist_specialties.nails', label: 'Nails' },
      { name: 'therapist_specialties.manicure_pedicure', label: 'Manicure/Pedicure' },
      { name: 'therapist_specialties.mens_grooming', label: 'Men\'s Grooming' },
      { name: 'therapist_specialties.bridal', label: 'Bridal' },
      { name: 'therapist_specialties.cosmetology_dermatology', label: 'Cosmetology/Dermatology' },
    ];

    const experienceOptions = [
      'Less than 1 year',
      '1 to 3 years',
      '3 to 7 years',
      '7+ years',
    ];

  return (
    <div className='mb-[100px] mt-6 max-w-[1200px] mx-auto'>
      <h2 className='font-medium text-[20px] sm:text-[30px] font-semibold sm:mb-4 pl-5'>Want to partner with us ?</h2>

      <form onSubmit={handleSubmit(Submit)} className='mx-[22px] flex flex-col gap-[14px]'>
        {formFields.map((field, index) => (
          <div key={index}>
            {(field.type === 'text' || field.type === 'number') && (
              <div className="relative w-full">
                <input
                  type={field.type}
                  {...register(field.name, { ...field.validtion })}
                  name={field.name}
                  placeholder={""}
                  className={`block p-[15px] w-full sm:w-[70%] text-base text-gray-900 bg-white border ${errors[field.name] ? 'border-red-500' : 'border-[#B9B9B9]'} rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 peer transition-all duration-300`}
                />
                <label
                  htmlFor={field.name}
                  className='absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3'
                >
                  <span>{field.label}</span>
                </label>
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>}
              </div>
            )}

            {field.type === 'radio' && (
              <label className='flex flex-col gap-[12px]'>
                <span className='font-semibold'>{field.label}</span>
                {field.options.map((option, i) => (
                  <div key={i}>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Radio
                          isChecked={value === option}
                          label={option}
                          name={field.name}
                          value={option}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                ))}
              </label>
            )}

            {/* Render therapist specialties only when 'Stylist/Therapist' is selected */}
            {field.name === 'your_position' && positionValue === 'Stylist/Therapist' && (
              <div className='flex flex-col gap-[12px] pl-8 mt-4'>
                <span className='font-semibold'>Select Specialties:</span>
                {therapistSpecialties.map((specialty, i) => (
                  <Controller
                    key={i}
                    name={specialty.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        isChecked={value}
                        label={specialty.label}
                        onChange={onChange}
                      />
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        
        <h3 className='font-semibold mt-1 text-[18px]'>Experience</h3>
        <div className='relative w-full sm:w-[70%]'>
          <select
            {...register('experience', { required: "Experience is required" })}
            className={`block p-[15px] w-full text-base text-gray-900 bg-white border ${errors.experience ? 'border-red-500' : 'border-[#B9B9B9]'} rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 transition-all duration-300`}
          >
            <option value="">Select Experience</option>
            {experienceOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
        </div>
        
        {/* Work/Training Experience Textarea */}
        <div className="relative w-full mt-4">
                    <textarea
                        {...register("work_training_experience", { required: "Work/Training Experience is required" })}
                        placeholder="Tell us where you got your training, where you worked, and what position and for how long"
                        className={`block p-[15px] overflow-y-hidden w-full sm:w-[70%] text-base text-gray-900 bg-white border ${errors.work_training_experience ? 'border-red-500' : 'border-[#B9B9B9]'} rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 peer`}
                    />
                    {errors.work_training_experience && <p className="text-red-500 text-sm mt-1">{errors.work_training_experience.message}</p>}
        </div>

        <button type="submit" className='bg-[#72B5EC] text-white font-semibold text-[16px] px-[50px] py-[15px] w-full sm:w-[70%] rounded-lg flex justify-center'>
          {
            isSubmitting ? <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg> :
              "Submit"
          }
        </button>
      </form>
    </div>
  )
}

export default Form;
