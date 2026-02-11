import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import api from '../api';
import './QRScanner.css';

const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
};

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState({ loading: false, error: null, success: null });
    const scannerRef = useRef(null);

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                'qr-reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                },
                false // verbose
            );

            const onScanSuccess = (decodedText, decodedResult) => {
                if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                }
                setIsScanning(false);
                setScanResult(decodedText);
                handleAttendanceMarking(decodedText);
            };

            const onScanFailure = (error) => {
                // Not a real error, just QR not found. Quietly ignore.
            };

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }
    }, [isScanning]);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Scanner clear failed", err));
            }
        };
    }, []);

    const handleAttendanceMarking = (qrCodeData) => {
        setStatus({ loading: true, error: null, success: null });

        if (!navigator.geolocation) {
            setStatus({ loading: false, error: 'Geolocation is not supported by your browser.', success: null });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const deviceIdentifier = getDeviceId();

                try {
                    const res = await api.post('/attendance/mark', {
                        qrCodeData,
                        studentLat: latitude,
                        studentLng: longitude,
                        deviceIdentifier,
                    });
                    setStatus({ loading: false, error: null, success: res.data.message });
                } catch (err) {
                    setStatus({ loading: false, error: err.response?.data?.message || 'An error occurred.', success: null });
                }
            },
            () => {
                setStatus({ loading: false, error: 'Unable to retrieve your location. Please enable location services.', success: null });
            }
        );
    };

    const startScan = () => {
        setScanResult(null);
        setStatus({ loading: false, error: null, success: null });
        setIsScanning(true);
    };

    const stopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
        }
        setIsScanning(false);
    };

    return (
        <div className="qr-scanner-container">
            <header className="qr-scanner-header">
                <h1>Scan Course QR Code</h1>
                <p>Point your camera at the QR code displayed by the lecturer to mark your attendance.</p>
            </header>

            <div className="scanner-card">
                {!isScanning && (
                    <div className="scanner-idle">
                         <p>Click the button to start scanning for a QR code.</p>
                        <motion.button onClick={startScan} className="action-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Start Scanner
                        </motion.button>
                    </div>
                )}

                <div id="qr-reader" className={isScanning ? 'scanning-active' : 'scanning-inactive'}></div>

                {isScanning && (
                    <button onClick={stopScan} className="stop-scan-button">
                        Cancel
                    </button>
                )}
            </div>

            <AnimatePresence>
                {(status.loading || status.error || status.success) && (
                    <motion.div
                        className="status-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="status-modal"
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            {status.loading && (
                                <>
                                    <div className="loading-spinner"></div>
                                    <h3>Processing Attendance...</h3>
                                    <p>Verifying your location and course details.</p>
                                </>
                            )}
                            {status.error && (
                                <>
                                    <div className="status-icon error-icon">✕</div>
                                    <h3>Attendance Failed</h3>
                                    <p>{status.error}</p>
                                    <button onClick={() => setStatus({ loading: false, error: null, success: null })} className="action-button">
                                        Try Again
                                    </button>
                                </>
                            )}
                            {status.success && (
                                <>
                                    <div className="status-icon success-icon">✓</div>
                                    <h3>Success!</h3>
                                    <p>{status.success}</p>
                                     <button onClick={() => setStatus({ loading: false, error: null, success: null })} className="action-button">
                                        Done
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QRScanner;
