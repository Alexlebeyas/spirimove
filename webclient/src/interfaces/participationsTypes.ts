export interface IParticipationType {
    id: number;
    name: string;
    description: string;
    from_date: string;
    to_date: string;
    can_be_intensive: boolean;
    can_have_organizer: boolean;
}
