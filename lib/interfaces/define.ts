/**
 * master server info
 */
export interface MasterInfo
{
	id: string;
	host: string;
	port: number;
}

/**
 * ServerInfo
 */
export interface ServerInfo
{
	id: string;
	serverType: string;
	host: string;
	port: number;
	clientHost: string;
	clientPort: number;
}
