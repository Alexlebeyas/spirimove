import { PageContainer, LinearProgress, ProfileImage } from '@/components';
import { OFFICES } from '@/constants';
import { useLeaderboard } from '@/hooks';
import useContestStore from '@/stores/useContestStore';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { contest, numberDaysFromStart } = useContestStore((state) => state);
  const { data, getAllSortedByDays, getTopFromOffice } = useLeaderboard(contest);

  return (
    <PageContainer>
      <div className="mb-3 flex flex-col-reverse lg:flex-row">
        <div className="mr-3  w-full lg:w-2/3">
          <div className="mb-3 max-h-[500px] overflow-hidden rounded-md bg-white p-4 shadow-md">
            <h3 className="mb-5">{t('Leaderboard.AllOffices')}</h3>
            <div className="h-[400px] overflow-y-scroll pr-4">
              {data.map((data, idx) => (
                <>
                  <div className="mb-3 last:mb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="mr-1 flex h-[100%] items-center font-bold">
                        <div className="mr-6 text-lg">{idx + 1}</div>
                        <div className="flex items-center">
                          <div className="mr-2">
                            <ProfileImage name={data.user__display_name} size={40} fontSize={18} />
                          </div>
                          <div>
                            <div className="font-semibold">{data.user__display_name}</div>
                            <div className="text-sm font-medium leading-[14px] text-gray-500">{data.user__office}</div>
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold">{data.total_points} pts</div>
                    </div>
                  </div>
                  <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
                </>
              ))}
            </div>
          </div>
          <div className="max-h-[500px] rounded-md bg-white p-4">
            <h3 className="mb-5">Participation days</h3>
            <div className="h-[400px] overflow-y-scroll pr-4">
              {getAllSortedByDays().map((data) => (
                <>
                  <div className="mb-3">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2">
                        <ProfileImage name={data.user__display_name} size={40} fontSize={18} />
                      </div>
                      <div className="w-full">
                        <div className="font-semibold">{data.user__display_name}</div>
                        <div className="flex justify-between">
                          <div className="text-sm leading-[14px] text-gray-500">{data.user__office}</div>
                          <div className="text-sm font-semibold">{data.total_days}d</div>
                        </div>
                      </div>
                    </div>
                    <LinearProgress value={Number(data.total_days)} max={numberDaysFromStart} />
                  </div>
                  <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col lg:w-1/3">
          {OFFICES.map((office) => (
            <div className="mb-3 w-full rounded-md bg-white p-4 shadow-md last:mr-0">
              <h3 className="mb-5">{t(`Office.${office}`)}</h3>
              {getTopFromOffice(office, 3).map((data, idx) => (
                <>
                  <div className="mb-3 last:mb-0">
                    <div className="mr-1 flex h-[100%] items-center justify-between">
                      <div className="mr-6 text-lg font-bold">{idx + 1}</div>
                      <div className="flex w-full items-center">
                        <div className="mr-2">
                          <ProfileImage name={data.user__display_name} size={40} fontSize={18} />
                        </div>
                        <div>
                          <div className="font-semibold">{data.user__display_name}</div>
                          <div className="text-sm font-medium leading-[14px] text-gray-500">{data.total_points}pts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 h-[1px] w-full bg-slate-200 last:hidden"></div>
                </>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
