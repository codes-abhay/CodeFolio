import React, { Fragment, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const filteredProfiles = useMemo(() => {
    console.log('Calculating filtered profiles list...');
    if (!searchQuery) return profiles;
    return profiles.filter((profile) => {
      const nameMatch =
        profile.user &&
        profile.user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const skillMatch =
        profile.skills &&
        profile.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return nameMatch || skillMatch;
    });
  }, [profiles, searchQuery]);

  return (
    <section className="container">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            developers
          </p>
          <div className="search-box mys-2">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                fontSize: '16px'
              }}
            />
          </div>
          <div className="profiles">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
