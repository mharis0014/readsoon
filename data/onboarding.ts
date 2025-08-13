export interface OnboardingSlide {
    id: number;
    title: string;
    subtitle: string;
    image: any;
}

export const onboardingSlides: OnboardingSlide[] = [
    {
        id: 1,
        title: 'Save Articles Instantly',
        subtitle: 'Save any article from the web with just one tap and read it later at your convenience.',
        image: require('../assets/illustrations/1.png')
    },
    {
        id: 2,
        title: 'Read Anywhere',
        subtitle: 'Access your saved articles across all your devices, even offline.',
        image: require('../assets/illustrations/2.png')
    },
    {
        id: 3,
        title: 'Stay Focused',
        subtitle: 'Enjoy a distraction-free reading experience with our clean, minimalist interface.',
        image: require('../assets/illustrations/3.png')
    }
]; 