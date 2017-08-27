import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import JobList from '@/components/JobList';
import authentication from '@/services/authentication';
import projectStatus from '@/utils/projectStatus';
import jobsApi from '@/api/jobs';

Vue.use(VueAnalytics, {
  id: `${process.env.ANALYTICS_ID}`,
});

describe('Unit | Component | JobList.vue', () => {
  let component;
  let jobs;
  let expectedJobs;
  const Constructor = Vue.extend(JobList);

  beforeEach(() => {
    // given
    sinon.stub(authentication, 'isAuthenticated').returns(true);
  });

  afterEach(() => {
    authentication.isAuthenticated.restore();
  });

  it('should be named "JobList"', () => {
    // when
    component = new Constructor().$mount();
    expect(component.$options.name).to.equal('JobList');
  });

  it('should have an interest modal', () => {
    const interestModal = component.$el.querySelectorAll('.interest-modal-wrapper');
    expect(interestModal.length).to.equal(1);
  });

  // TODO check that interest modal use chosenJob

  describe('on interest', () => {
    beforeEach(() => {
      sinon.stub(component.$modal, 'show');
      // TODO extract fixtures
      jobs = [
        {
          id: 1,
          activity: {
            title: 'Tech Lead mission 1',
          },
          project: {
            id: 123456,
            status: 'proposal_in_progress',
            name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
            customer: {
              name: 'La Poste - Courrier',
            },
            staffing_needed_from: '2017-07-01',
            duration: '10 mois',
            location: 'OCTO',
            business_contact: {
              nickname: 'ABC',
            },
            mission_director: {
              nickname: 'XYZ',
            },
          },
        },
        {
          id: 2,
          activity: {
            title: 'Tech Lead mission 2',
          },
          project: {
            id: 123456,
            status: 'mission_signed',
            name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
            customer: {
              name: 'La Poste - Courrier',
            },
            staffing_needed_from: '2017-07-01',
            duration: '10 mois',
            location: 'OCTO',
            business_contact: {
              nickname: 'ABC',
            },
            mission_director: {
              nickname: 'XYZ',
            },
          },
        },
      ];
      sinon.stub(jobsApi, 'fetchAll').resolves(jobs);

      component = new Constructor().$mount();
    });

    afterEach(() => {
      component.$modal.show.restore();
      jobsApi.fetchAll.restore();
    });

    it('should displayInterestModal on click on interest', () => Vue.nextTick().then(() => {
      // when
      component.$el.querySelector('button.job__apply-button').click();

      // then
      expect(component.$modal.show).to.have.been.calledWith('interest-modal');
    }));
  });

  describe('method #displayInterestModal', () => {
    beforeEach(() => {
      sinon.stub(component.$modal, 'show');
    });

    afterEach(() => {
      component.$modal.show.restore();
    });

    it('should add job to the chosenJob data', () => {
      // Given
      const job = { foo: 'bar' };

      // When
      component.displayInterestModal(job);

      // Then
      expect(component.$data.chosenJob).to.equal(job);
    });

    it('should display the interest-modal', () => {
      // when
      component.displayInterestModal();

      // then
      expect(component.$modal.show).to.have.been.calledWith('interest-modal');
    });
  });

  describe('method #getJobs', () => {
    it('should verify that user is authenticated', () => {
      // when
      component = new Constructor().$mount();
      expect(authentication.isAuthenticated).to.have.been.called;
    });

    describe('before jobs are loaded', () => {
      beforeEach(() => {
        // given
        sinon.stub(jobsApi, 'fetchAll').rejects();

        // when
        component = new Constructor().$mount();
      });

      afterEach(() => {
        jobsApi.fetchAll.restore();
      });

      it('should not render any jobs', () => Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.job-results-panel')).to.be.null;
      }));

      it('should display loading spinner', () => Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.loading-spinner')).to.exist;
      }));
    });

    describe('after jobs are loaded', () => {
      beforeEach(() => {
        // given
        jobs = [
          {
            id: 1,
            activity: {
              title: 'Tech Lead mission 1',
            },
            project: {
              id: 123456,
              status: 'proposal_in_progress',
              name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
              customer: {
                name: 'La Poste - Courrier',
              },
              staffing_needed_from: '2017-07-01',
              duration: '10 mois',
              location: 'OCTO',
              business_contact: {
                nickname: 'ABC',
              },
              mission_director: {
                nickname: 'XYZ',
              },
            },
          },
          {
            id: 2,
            activity: {
              title: 'Tech Lead mission 2',
            },
            project: {
              id: 123456,
              status: 'mission_signed',
              name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
              customer: {
                name: 'La Poste - Courrier',
              },
              staffing_needed_from: '2017-07-01',
              duration: '10 mois',
              location: 'OCTO',
              business_contact: {
                nickname: 'ABC',
              },
              mission_director: {
                nickname: 'XYZ',
              },
            },
          },
        ];
        expectedJobs = [{

          id: 2,
          activity: {
            title: 'Tech Lead mission 2',
          },
          project: {
            id: 123456,
            status: 'mission_signed',
            name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
            customer: {
              name: 'La Poste - Courrier',
            },
            staffing_needed_from: '2017-07-01',
            duration: '10 mois',
            location: 'OCTO',
            business_contact: {
              nickname: 'ABC',
            },
            mission_director: {
              nickname: 'XYZ',
            },
          },
        },
        {
          id: 1,
          activity: {
            title: 'Tech Lead mission 1',
          },
          project: {
            id: 123456,
            status: 'proposal_in_progress',
            name: 'SCLOU - Cloud computing : enjeux, architecture et gouvernance du IaaS, CaaS, PaaS INTER 2017',
            customer: {
              name: 'La Poste - Courrier',
            },
            staffing_needed_from: '2017-07-01',
            duration: '10 mois',
            location: 'OCTO',
            business_contact: {
              nickname: 'ABC',
            },
            mission_director: {
              nickname: 'XYZ',
            },
          },
        },
        ];

        sinon.stub(projectStatus, 'sort').returns(expectedJobs);
        sinon.stub(jobsApi, 'fetchAll').resolves(jobs);

        // when
        component = new Constructor().$mount();
      });

      afterEach(() => {
        projectStatus.sort.restore();
        jobsApi.fetchAll.restore();
      });

      it('should render as many jobs as received from the API', () => Vue.nextTick().then(() => {
        const jobCards = component.$el.querySelectorAll('.job-card');
        expect(jobCards.length).to.equal(2);
      }));

      it('should add number of available jobs', () => Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.job-results__title').textContent.trim()).to.equal('Missions à staffer (2)');
      }));

      it('should sort the mission jobs', () => Vue.nextTick().then(() => {
        const jobTitles = component.$el.querySelectorAll('.job__title');
        expect(jobTitles[0].textContent).to.equal('Tech Lead mission 2');
        expect(jobTitles[1].textContent).to.equal('Tech Lead mission 1');
      }));
    });
  });
});

