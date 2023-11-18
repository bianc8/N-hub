"use client";

import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";

const GET_MY_ATTESTATIONS = gql`
  query Schemas($resolverAddress: String!){
    attestations(
      where: {
        schema: {
          is: {
            resolver: { equals: $resolverAddress }
          }
        }
      }
    ) {
      schema {
        id
        creator
        resolver
        _count {
          attestations
        }
      }
    }
  }
`;

const MySchemas = () => {
  // sepolia resolver
  const variables = {resolverAddress: "0xB4Fb406b75db78D69c28E616Ef317f6ea6FE3497"}
  // base resolver
  // const variables = {resolverAddress: "0xc5ed581f35741340B4804CEf076Adc5C9C46A872"}
  const { signer } = useWeb3ModalSigner()
  signer?.getChainId().then((chainId) => {
    if (chainId !== 11155111) {
      variables.resolverAddress = "0xc5ed581f35741340B4804CEf076Adc5C9C46A872";
    }
  });
  
  const { loading, error, data } = useQuery(GET_MY_ATTESTATIONS);
  console.log(loading, error, data);


  if (!!error) return <p>Error :(</p>;
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <table className="table table-zebra">
      <thead>
        <tr>
          <th>Schema ID</th>
          <th>Schema Creator</th>
          <th>Schema Resolver</th>
          <th>Number of Attestations</th>
        </tr>

      {data.attestations.map((attestation: any, index: number) => (
        <tr key={index}>
          <td>{attestation.schema.id.length > 10 ? attestation.schema.id.slice(0, 10)+'...' : attestation.schema.id}</td>
          <td>{attestation.schema.creator.length > 10 ? attestation.schema.creator.slice(0, 10)+'...' : attestation.schema.creator}</td>
          <td>{attestation.schema.resolver.length > 10 ? attestation.schema.resolver.slice(0, 10)+'...' : attestation.schema.resolver}</td>
          <td>{attestation.schema._count.attestations}</td>
        </tr>
      ))}
      </thead>
    </table>
  )
}


export default MySchemas;