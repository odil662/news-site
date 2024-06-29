const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStories(): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/topstories.json`);
  return response.json();
}

export async function fetchNewStories(): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/newstories.json`);
  return response.json();
}

export async function fetchBestStories(): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/beststories.json`);
  return response.json();
}

export async function fetchItem(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/item/${id}.json?print=pretty`);
  return response.json();
}

export async function fetchComments(ids: number[]): Promise<never[]> {
  const commentPromises = ids.map(id => fetchItem(id));
  return Promise.all(commentPromises);
}

export async function fetchStories(type: 'top' | 'new' | 'best', limit: number = 30, offset: number = 0): Promise<never[]> {
  let storyIds;
  switch (type) {
    case 'top':
      storyIds = await fetchTopStories();
      break;
    case 'new':
      storyIds = await fetchNewStories();
      break;
    case 'best':
      storyIds = await fetchBestStories();
      break;
  }
  const paginatedIds = storyIds.slice(offset, offset + limit);
  const storyPromises = paginatedIds.map(id => fetchItem(id));
  return Promise.all(storyPromises);
}

