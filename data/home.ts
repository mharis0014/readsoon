export interface ArticleData {
    id: string;
    title: string;
    content: string;
    htmlContent?: string;
    image: any;
    author: string;
    date: string;
    category: string;
    authorImage?: any;
    isSaved?: boolean;
}

export const mockTopPicks: ArticleData[] = [
    {
        id: '1',
        title: 'The Future of AI in Healthcare',
        content: 'Artificial Intelligence is revolutionizing healthcare delivery, from diagnosis to treatment planning. This comprehensive guide explores the latest developments and their implications for patients and providers alike.',
        image: require('../assets/images/topPicks/1.png'),
        author: 'Dr. Sarah Chen',
        date: 'Mar 15, 2024',
        category: 'Technology'
    },
    {
        id: '2',
        title: 'Sustainable Living: A Complete Guide',
        content: 'Discover practical ways to reduce your environmental footprint while improving your quality of life. From zero-waste practices to renewable energy solutions, learn how to make sustainable choices every day.',
        image: require('../assets/images/topPicks/2.png'),
        author: 'Emma Rodriguez',
        date: 'Mar 14, 2024',
        category: 'Lifestyle'
    },
    {
        id: '3',
        title: 'The Psychology of Productivity',
        content: 'Understanding the science behind productivity can help you work smarter, not harder. This article delves into cognitive psychology principles that can transform your approach to work and life.',
        image: require('../assets/images/topPicks/3.png'),
        author: 'Dr. Michael Thompson',
        date: 'Mar 13, 2024',
        category: 'Psychology'
    }
];

export const mockStaffPicks: ArticleData[] = [
    {
        id: '4',
        title: 'The Art of Mindful Communication',
        content: 'Learn how to communicate more effectively by practicing mindfulness in your daily interactions. This guide provides practical techniques for better listening, speaking, and understanding.',
        image: require('../assets/images/staffPicks/1.jpg'),
        author: 'Lisa Park',
        date: 'Mar 12, 2024',
        category: 'Communication'
    },
    {
        id: '5',
        title: 'Digital Nomad Lifestyle: Pros and Cons',
        content: 'Explore the reality of working remotely while traveling the world. This honest account covers the challenges, rewards, and practical considerations of the digital nomad lifestyle.',
        image: require('../assets/images/staffPicks/2.jpg'),
        author: 'Alex Johnson',
        date: 'Mar 11, 2024',
        category: 'Travel'
    }
]; 