import { PageContainer } from '@/components';
import MyContestScore from '@/components/MyContestScore';
import { SpiriMoveProgress } from '@/components/SpiriMoveProgress';

export const MySpiriMove = () => {
  return (
    <PageContainer>
      <MyContestScore />
      <SpiriMoveProgress />
    </PageContainer>
  );
};
