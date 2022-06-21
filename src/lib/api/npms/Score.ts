export interface ScoreDetail {
    quality: number;
    popularity: number;
    maintenance: number;
}

export default interface Score {
    final: number;
    detail: ScoreDetail;
}
