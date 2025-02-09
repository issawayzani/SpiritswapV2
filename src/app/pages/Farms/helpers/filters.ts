import { IFarm, FarmType, EcosystemFarmType } from 'app/interfaces/Farm';

export const handleFarmData = (data, index) => {
  switch (index) {
    case 0:
      return data;
    case FarmType.CANTO:
      return data.filter(farm => farm.type === 'canto');
    case FarmType.FORTE:
      return data.filter(farm => farm.type === 'forte');
    // case FarmType.ADMIN:
    //   return data.filter(farm => farm.type === 'admin');

    default:
      return data;
  }
};

export const filterByQuery = (pool: IFarm, query: string) => {
  return pool?.title?.toLowerCase().includes(query.toLowerCase());
};

export const filterByState = (
  pool: IFarm,
  filterByStaked,
  filterByInactive,
  farmsStaked,
) => {
  const lpFarmId = `${pool.lpAddress?.toLowerCase()}`;
  const staked = farmsStaked[lpFarmId]
    ? parseFloat(farmsStaked[lpFarmId].amount) > 0
    : false;
  const inactive = !(parseFloat(pool.apr!) > 0);

  const filterType = [filterByStaked, filterByInactive];
  const filterValue = [staked, inactive];

  const filterResult = filterType.every((type, index) => {
    if (type) {
      return filterValue[index];
    }

    return true;
  });

  return filterByInactive ? filterResult : filterResult && !inactive;
};
