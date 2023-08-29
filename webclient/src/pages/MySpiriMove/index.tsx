import { PageContainer } from '@/components';
import MyContestScore from '@/components/MyContestScore';
import { SpiriMoveProgress } from '@/components/SpiriMoveProgress';
import useContestStore from '@/stores/useContestStore';

export const MySpiriMove = () => {
  const { contest } = useContestStore((state) => state);
  return (
    <PageContainer>
      <MyContestScore contestId={contest.id.toString()} />
      <SpiriMoveProgress contest={contest} />
    </PageContainer>
  );
};
