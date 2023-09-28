import { PageContainer } from '@/components';
import MyContestScore from '@/components/MyContestScore';
import { SpiriMoveProgress } from '@/components/SpiriMoveProgress';
import Calendar from '@/components/Calendar';

export const MySpiriMove = () => {
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div className="order-1 w-full md:w-auto flex-shrink-0">
          <MyContestScore />
        </div>
        <div className="order-2 w-full md:w-auto flex-shrink-0">
          <Calendar />
        </div>
      </div>
      <SpiriMoveProgress />
    </PageContainer>
  );
};

