import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user
  }
}) => {
  const { name } = user || {};
  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
          <p>{bio}</p>
          <div className='line' />
        </Fragment>
      )}
      <h2 className='text-primary'>Skill Set</h2>
      <div className='skills' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {skills.map((skill, index) => (
          <div key={index} className='p-1 badge badge-primary' style={{ borderRadius: '20px', padding: '0.5rem 1rem' }}>
            <i className='fas fa-check' /> {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
