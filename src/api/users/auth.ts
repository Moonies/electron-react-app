const checkAuth = async (username: string, password: string) => {
    // This is a mock API call. Replace with actual API call in production.
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                resolve({ id: 1, username: 'admin', name: 'Admin User' });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
};

export default checkAuth