import SpiriMoveProgressItem from '@/components/SpiriMoveProgressItem';
import {ViewProps} from './interfaces';


const MobileView: React.FC<ViewProps> = ({
    participations,
    setConfirmDelOpen,
    setIsEditParticipationModalOpen,
    setParticipationToHandle,
  }) => (
    <div className="my-5 flex w-full flex-col overflow-hidden rounded-lg sm:bg-white sm:shadow-lg">
      {participations.map((currentParticipation, index) => (
        <SpiriMoveProgressItem
          key={index}
          currentDate={currentParticipation.contestDate}
          participation={currentParticipation.participation}
          setConfirmDeleteOpen={setConfirmDelOpen}
          setIsEditParticipationModalOpen={setIsEditParticipationModalOpen}
          setParticipationToHandle={setParticipationToHandle}
          viewMode={'card'}
        />
      ))}
    </div>
  );

  export default MobileView;