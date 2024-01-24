// src/api/userApi.js
import { QueryFunction, useQuery } from '@tanstack/vue-query';
import axios from 'axios';

interface TestData {
  id: number;
  name: string;
}

// type FetchTestDataQuery = QueryFunction<TestData, [string, number]>;

const { isPending, isError, data, error } = useQuery({
  queryKey: ['test'],
  queryFn:  async () => {
    const response = await axios.get(`/api/test/`);
    return response.data as TestData;
  }
})

console.log(isPending, isError, data, error)


