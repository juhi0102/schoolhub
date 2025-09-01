import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [serverMsg, setServerMsg] = useState('');

  const onSubmit = async (data) => {
    setServerMsg('');
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'image' && v && v.length) formData.append('image', v[0]);
      else formData.append(k, v);
    });
    try {
      const res = await fetch('/api/schools', { method: 'POST', body: formData });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Failed');
      setServerMsg('✅ School added successfully!');
      reset();
    } catch (e) {
      setServerMsg(`❌ ${e.message}`);
    }
  };

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:16}}>
        <h1>Add School</h1>
        <a href="/showSchools" className="btn btn-secondary">View Schools</a>
      </div>
      <div className="card" style={{marginTop:12}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div>
              <label className="label">School Name</label>
              <input className="input" placeholder="e.g., Greenwood High"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="school@example.com"
                {...register('email_id', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                })} />
              {errors.email_id && <p className="error">{errors.email_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <textarea className="input" rows={3} placeholder="Street, Area, Landmark"
              {...register('address', { required: 'Address is required', minLength: { value: 5, message: 'Too short' } })} />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </div>

          <div className="row" style={{marginTop:12}}>
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="e.g., Mumbai"
                {...register('city', { required: 'City is required' })} />
              {errors.city && <p className="error">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" placeholder="e.g., Maharashtra"
                {...register('state', { required: 'State is required' })} />
              {errors.state && <p className="error">{errors.state.message}</p>}
            </div>
          </div>

          <div className="row" style={{marginTop:12}}>
            <div>
              <label className="label">Contact Number</label>
              <input className="input" type="tel" placeholder="10-digit number"
                {...register('contact', {
                  required: 'Contact is required',
                  pattern: { value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit number' }
                })} />
              {errors.contact && <p className="error">{errors.contact.message}</p>}
            </div>
            <div>
              <label className="label">School Image</label>
              <input className="file" type="file" accept="image/*"
                {...register('image', { required: 'Image is required' })} />
              {errors.image && <p className="error">{errors.image.message}</p>}
              <p className="help">Accepted: JPG, PNG. Max ~5MB (browser dependent).</p>
            </div>
          </div>

          <div style={{display:'flex', gap:8, marginTop:16}}>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save School'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => reset()}>Reset</button>
          </div>
          {serverMsg && <p className="help" style={{marginTop:12}}>{serverMsg}</p>}
        </form>
      </div>
    </div>
  );
}