import { Decimal128 } from 'mongodb'

export interface Environment {
	USERNAME: string
	PASSWORD: string
	CLUSTER: string
}

export interface CurrencyObject {
	Date: Date
	CurrencyCode: {
		[currency: string]: {
			AUDPerUnit: Decimal128
			UnitsPerAUD: Decimal128
		}
	}
}
