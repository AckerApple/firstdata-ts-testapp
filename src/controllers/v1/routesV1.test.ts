import * as supertest from 'supertest';

import {} from 'jasmine';
import {OK, BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import { SuperTest, Test } from 'supertest';
import { Logger } from '@overnightjs/logger';

import TestServer from '../common/TestServer.test';
import { V1Controller  }from './routesV1';


describe('V1Controller', () => {

    const curV1Controller = new V1Controller();
    let agent: SuperTest<Test>;


    beforeAll(done => {
        const server = new TestServer();
        server.setController(curV1Controller);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });


    describe('API: "/api/v1/parse"', () => {
        let mockPayloadString = "JOHN0000MICHAEL0009994567";
        let mockResponseJson = {
            statusCode: 200,
            data: {
                firstName: mockPayloadString.substring(0,8),
                lastName: mockPayloadString.substring(8,18),
                clientId: mockPayloadString.substring(18,25)
            }
        };

        it(`should return a JSON object and a status code
            of "${OK}" if message was successful`, done => {

            agent.post('/api/v1/parse')
                .send({data: mockPayloadString})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err, true);
                    }
                    expect(res.status).toBe(OK);
                    expect(res.body).toEqual(mockResponseJson);
                    done();
                });
        });

        it(`should return a JSON object with the "error" param and a status code of "${BAD_REQUEST}"
            if message was unsuccessful`, done => {

            agent.post('/api/v2/failEndpoint')
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err, true);
                    }
                    expect(res.status).toBe(NOT_FOUND);
                    done();
                });
        });
    });
});