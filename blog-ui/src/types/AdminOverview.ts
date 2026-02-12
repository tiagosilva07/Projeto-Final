export type AdminOverview = {
    totalPosts: number;
    totalComments: number;
    totalUsers: number;
    activity: Array<{
        type: string;
        id: number;
        titleOrContent: string;
        author: string;
        createdAt: string;
    }>;
};