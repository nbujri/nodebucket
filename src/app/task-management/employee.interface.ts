/**
 * title: employee.interface.ts
 * author: ngi bujri
 * date: august 23 2023
 * description: employee interface
 */

import { Item } from './item.interface';

export interface Employee {
  empId: number;
  todo: Item[];
  done: Item[];
}
